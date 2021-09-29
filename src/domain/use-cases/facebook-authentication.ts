import { LoadFacebookUserApi } from '@/domain/contracts/apis'
import { AuthenticationError } from '@/domain/entities/errors'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/domain/contracts/repos/user-account'
import { FacebookAccount, AccessToken } from '@/domain/entities/index'
import { TokenGenerator } from '@/domain/contracts/crypto/'

type Setup = (facebookApi: LoadFacebookUserApi, userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository, crypto: TokenGenerator) => FacebookAuthentication
export type FacebookAuthentication = (params: { token: string }) => Promise<{ accessToken: string }>

export const setupFacebookAuthenticationUseCase: Setup = (
  facebookApi,
  userAccountRepo,
  crypto
) => async params => {
  const fbData = await facebookApi.loadUser(params)
  if (fbData !== undefined) {
    const accountData = await userAccountRepo.load({ email: fbData.email })
    const facebookAccount = new FacebookAccount(fbData, accountData)
    const { id } = await userAccountRepo.saveWithFacebook(facebookAccount)
    const accessToken = await crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
    return { accessToken }
  }
  throw new AuthenticationError()
}
