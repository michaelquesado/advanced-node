import { LoadFacebookUserApi } from '@/data/contracts/apis/'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos/user-account'
import { FacebookAuthenticationService } from '@/data/services/'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { FacebookAccount } from '@/domain/models'

import { mocked } from 'ts-jest/utils'
import { mock, MockProxy } from 'jest-mock-extended'
import { TokenGenerator } from '@/data/contracts/crypto/token'

jest.mock('@/domain/models/facebook-account')

describe('Facebook Authentication Service', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let cryto: MockProxy<TokenGenerator>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let sut: FacebookAuthentication
  const token = 'any_token'
  beforeEach(() => {
    facebookApi = mock()
    cryto = mock()
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    userAccountRepo.saveWithFacebook.mockResolvedValueOnce({
      id: 'any_id'
    })
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepo,
      cryto
    )
  })
  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })
  it('should return Authentication error if LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockReturnValueOnce(Promise.resolve(undefined))
    const authResult = await sut.perform({ token })
    expect(authResult).toEqual(new AuthenticationError())
  })
  it('should call LoadUserAccountRepo when LoadFacebookUserApi return data', async () => {
    await sut.perform({ token })
    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })
  it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }))
    mocked(FacebookAccount).mockImplementation(FacebookAccountStub)
    await sut.perform({ token })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })
  it('should call TokenGenerator with correct params', async () => {
    await sut.perform({ token })

    expect(cryto.generateToken).toHaveBeenCalledWith({ key: 'any_id' })
    expect(cryto.generateToken).toHaveBeenCalledTimes(1)
  })
})
