import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { mock } from 'jest-mock-extended'

class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com'

  constructor (private readonly httpGetClient: HttpGetClient) {}
  async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
    await this.httpGetClient.get({ url: `${this.baseUrl}/oauth/access_token` })
  }
}

interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<void>
}

export namespace HttpGetClient {
  export type Params = {
    url: string
  }
}

describe('FacebookApi', () => {
  it('should get app token', async () => {
    const httpGetClient = mock<HttpGetClient>()
    const sut = new FacebookApi(httpGetClient)

    await sut.loadUser({ token: 'any_client_token' })
    expect(httpGetClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token'
    })
  })
})
