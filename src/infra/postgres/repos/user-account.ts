import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos/'
import { PgUser } from '@/infra/postgres/entities'

import { getRepository } from 'typeorm'

export class PgUserAccountRepository implements LoadUserAccountRepository {
  private readonly userRepo = getRepository(PgUser)

  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUser = await this.userRepo.findOne({ email: params.email })
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }

  async saveWithFacebook (params: SaveFacebookAccountRepository.Params): Promise<void> {
    if (params.id === undefined) {
      await this.userRepo.save({
        name: params.name,
        email: params.email,
        facebookId: params.facebookId
      })
    } else {
      await this.userRepo.update({ id: +params.id }, {
        name: params.name,
        facebookId: params.facebookId
      })
    }
  }
}
