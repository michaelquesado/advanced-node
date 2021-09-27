import { FacebookLoginController } from '@/application/controllers'
import { makeFacebookAuthenticationService } from '@/main/factories/use-cases'

export const makeFacebookLoginController = (): FacebookLoginController => {
  return new FacebookLoginController(makeFacebookAuthenticationService())
}
