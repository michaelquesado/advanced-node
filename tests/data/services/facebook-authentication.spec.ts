import { LoadFacebookUserApi } from '@/data/contracts/apis/'
import { LoadUserAccountRepository, CreateFacebookAccountRepository } from '@/data/contracts/repos/user-account'
import { FacebookAuthenticationService } from '@/data/services/'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'

import { mock, MockProxy } from 'jest-mock-extended'

describe('Facebook Authentication Service', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>
  let createFacebookAccountRepo: MockProxy<CreateFacebookAccountRepository>
  let sut: FacebookAuthentication
  const token = 'any_token'
  beforeEach(() => {
    loadFacebookUserApi = mock()
    loadUserAccountRepo = mock()
    createFacebookAccountRepo = mock()
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    sut = new FacebookAuthenticationService(
      loadFacebookUserApi,
      loadUserAccountRepo,
      createFacebookAccountRepo
    )
  })
  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })
  it('should return Authentication error if LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockReturnValueOnce(Promise.resolve(undefined))
    const authResult = await sut.perform({ token })
    expect(authResult).toEqual(new AuthenticationError())
  })
  it('should call LoadUserAccountRepo when LoadFacebookUserApi return data', async () => {
    await sut.perform({ token })
    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
  })
  it('should call CreateFacebookAccountRepo when LoadUserAccountRepo return undefined', async () => {
    loadUserAccountRepo.load.mockResolvedValueOnce(undefined)
    await sut.perform({ token })
    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      email: 'any_fb_email',
      name: 'any_fb_name',
      facebookId: 'any_fb_id'
    })
    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})
