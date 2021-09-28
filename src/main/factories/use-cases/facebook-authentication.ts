import { setupFacebookAuthenticationUseCase, FacebookAuthentication } from '@/domain/use-cases'
import { makeFacebookApi } from '@/main/factories/apis'
import { makePgUserAccountRepository } from '@/main/factories/repos'
import { makeJwtTokenGenerator } from '@/main/factories/crypto'

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  return setupFacebookAuthenticationUseCase(makeFacebookApi(), makePgUserAccountRepository(), makeJwtTokenGenerator())
}
