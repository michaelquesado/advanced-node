import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http/axios-client'
import { env } from '@/main/config/env'

describe('FacebookApi Integration Tests', () => {
  it('should return a Facebook User if token is valid', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)

    const fbUser = await sut.loadUser({ token: 'EAAFlhcjoNWwBALLLvCgVBSMSHLAyQ7qCWKK4hbrwnXCQBtJCXcgRReww4G7FYCippOYqZAbh6tMZCu7s72SJtDqLMbwE06PxGxRtNjKVMSihamLMCNrp6MoFpt980quQviCGyzcDmQv5EQGKBSZCURn26AbInbhZBU23JeX3fvrAJrRZCx441IaZARiXTwl7fhRZBZAZCh7tLAQcsN9lx4E41' })

    expect(fbUser).toEqual({
      facebookId: '100440632412559',
      name: 'Quesado Teste',
      email: 'quesado_mocngym_teste@tfbnw.net'
    })
  })
  it('should return undefined if token is invalid', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)

    const fbUser = await sut.loadUser({ token: 'invalid' })

    expect(fbUser).toBeUndefined()
  })
})
