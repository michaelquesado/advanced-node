import { LoadFacebookUserApi } from '@/domain/contracts/apis/'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/domain/contracts/repos/user-account'
import { FacebookAuthenticationService } from '@/domain/services/'
import { AuthenticationError } from '@/domain/entities/errors'
import { FacebookAuthentication } from '@/domain/features'
import { AccessToken, FacebookAccount } from '@/domain/entities'

import { mocked } from 'ts-jest/utils'
import { mock, MockProxy } from 'jest-mock-extended'
import { TokenGenerator } from '@/domain/contracts/crypto/token'

jest.mock('@/domain/entities/facebook-account')

describe('Facebook Authentication Service', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let crypto: MockProxy<TokenGenerator>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let sut: FacebookAuthentication
  let token: string
  beforeAll(() => {
    token = 'any_token'
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    userAccountRepo.saveWithFacebook.mockResolvedValue({
      id: 'any_id'
    })
    crypto = mock()
    crypto.generateToken.mockResolvedValue('any_generated_token')
  })
  beforeEach(() => {
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepo,
      crypto
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

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })
  it('should return a AccessToken on success', async () => {
    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AccessToken('any_generated_token'))
  })
  it('should rethrow if LoadFacebookUserApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'))
    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrow(new Error('fb_error'))
  })
  it('should rethrow if LoadUserAccountRepository throws', async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error('load_error'))
    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })
  it('should rethrow if SaveFacebookAccountRepository throws', async () => {
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))
    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })
  it('should rethrow if TokenGenerator throws', async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error('token_error'))
    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
