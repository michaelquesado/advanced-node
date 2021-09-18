import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos/'
import { PgUser } from '@/infra/postgres/entities'

import { getRepository } from 'typeorm'

export class PgUserAccountRepository implements LoadUserAccountRepository {
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const userRepo = getRepository(PgUser)
    const pgUser = await userRepo.findOne({ email: params.email })
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }

  async saveWithFacebook (params: SaveFacebookAccountRepository.Params): Promise<void> {
    const userRepo = getRepository(PgUser)
    await userRepo.save({
      name: params.name,
      email: params.email,
      facebookId: params.facebookId
    })
  }
}
