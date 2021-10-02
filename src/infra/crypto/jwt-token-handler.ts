import { TokenGenerator, TokenValidator } from '@/domain/contracts/crypto'

import jwt, { JwtPayload } from 'jsonwebtoken'

export class JwtTokenHandler implements TokenGenerator, TokenValidator {
  constructor (private readonly secret: string) {}

  async generateToken ({ expirationInMs, key }: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expiresInSeconds = expirationInMs / 1000
    return jwt.sign({ key }, this.secret, { expiresIn: expiresInSeconds })
  }

  async validateToken ({ token }: TokenValidator.Params): Promise<TokenValidator.Result> {
    const payload = jwt.verify(token, this.secret) as JwtPayload
    return payload.key
  }
}
