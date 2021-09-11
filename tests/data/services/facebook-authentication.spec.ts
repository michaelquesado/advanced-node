import { FacebookAuthentication } from '@/domain/features'
class FacebookAuthenticationService {
  constructor (private readonly loadFacebookUser: LoadFacebookUserApi) {}
  async perform (params: FacebookAuthentication.Params): Promise<void> {
    await this.loadFacebookUser.loadUser(params)
  }
}

interface LoadFacebookUserApi {
  loadUser: (params: LoadFacebookUserApi.Params) => LoadFacebookUserApi.Result
}
namespace LoadFacebookUserApi {
  export type Params = { token: string }
  export type Result = Promise<void>
}
class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string
  async loadUser (params: LoadFacebookUserApi.Params): LoadFacebookUserApi.Result {
    this.token = params.token
  }
}

describe('Facebook Authentication Service', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserApi.token).toBe('any_token')
  })
})
