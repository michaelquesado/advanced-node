import { TokenGenerator } from '@/data/contracts/crypto'

import jwt from 'jsonwebtoken'

export class JwtTokenGenerator implements TokenGenerator {
  constructor (private readonly secret: string) {}

  async generateToken ({ expirationInMs, key }: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expiresInSeconds = expirationInMs / 1000
    return jwt.sign({ key }, this.secret, { expiresIn: expiresInSeconds })
  }
}
