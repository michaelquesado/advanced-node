import { AuthenticationMiddleware } from '@/application/middleware'
import { makeJwtTokenHandler } from '@/main/factories/crypto'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const jwt = makeJwtTokenHandler()
  return new AuthenticationMiddleware(jwt.validateToken.bind(jwt))
}
