import { FacebookApi, AxiosHttpClient } from '@/infra/gateways'
import { env } from '@/main/config/env'

describe('FacebookApi Integration Tests', () => {
  let axiosClient: AxiosHttpClient
  let sut: FacebookApi
  const token = 'EAAFlhcjoNWwBALLLvCgVBSMSHLAyQ7qCWKK4hbrwnXCQBtJCXcgRReww4G7FYCippOYqZAbh6tMZCu7s72SJtDqLMbwE06PxGxRtNjKVMSihamLMCNrp6MoFpt980quQviCGyzcDmQv5EQGKBSZCURn26AbInbhZBU23JeX3fvrAJrRZCx441IaZARiXTwl7fhRZBZAZCh7tLAQcsN9lx4E41'

  beforeEach(() => {
    axiosClient = new AxiosHttpClient()
    sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)
  })
  it('should return a Facebook User if token is valid', async () => {
    const fbUser = await sut.loadUser({ token })

    expect(fbUser).toEqual({
      facebookId: '100440632412559',
      name: 'Quesado Teste',
      email: 'quesado_mocngym_teste@tfbnw.net'
    })
  })
  it('should return undefined if token is invalid', async () => {
    const fbUser = await sut.loadUser({ token: 'invalid' })

    expect(fbUser).toBeUndefined()
  })
})
