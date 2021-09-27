import { LoadFacebookUserApi } from '@/domain/contracts/apis'
import { HttpGetClient } from '@/infra/http'

type UserInfo = {
  id: string
  name: string
  email: string
}
type DebugToken = {
  data: {
    user_id: string
  }
}
type AppToken = {
  access_token: string
}
export class FacebookApi implements LoadFacebookUserApi {
  private readonly baseUrl = 'https://graph.facebook.com'

  constructor (
    private readonly httpGetClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser ({ token }: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    try {
      const fbUser = await this.getUserInfo(token)
      return {
        facebookId: fbUser.id,
        name: fbUser.name,
        email: fbUser.email
      }
    } catch (error) {
      return undefined
    }
  }

  private async getAppToken (): Promise<AppToken> {
    return this.httpGetClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }

  private async getDebugToken (clientToken: string): Promise<DebugToken> {
    const appToken = await this.getAppToken()
    return this.httpGetClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: clientToken
      }
    })
  }

  private async getUserInfo (clientToken: string): Promise<UserInfo> {
    const debugToken = await this.getDebugToken(clientToken)
    return this.httpGetClient.get({
      url: `${this.baseUrl}/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: clientToken
      }
    })
  }
}
