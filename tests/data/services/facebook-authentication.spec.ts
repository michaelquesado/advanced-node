import { LoadFacebookUserApi } from '@/data/contracts/apis/'
import { FacebookAuthenticationService } from '@/data/services/'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'

import { mock, MockProxy } from 'jest-mock-extended'

describe('Facebook Authentication Service', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let sut: FacebookAuthentication
  beforeEach(() => {
    loadFacebookUserApi = mock()
    sut = new FacebookAuthenticationService(loadFacebookUserApi)
  })
  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })
  it('should return Authentication error if LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockReturnValueOnce(Promise.resolve(undefined))
    const authResult = await sut.perform({ token: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })
})
