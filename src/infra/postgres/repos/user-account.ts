import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos/'
import { PgUser } from '@/infra/postgres/entities'

import { getRepository } from 'typeorm'

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  async load ({ email }: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const userRepo = getRepository(PgUser)
    const pgUser = await userRepo.findOne({ email })
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }

  async saveWithFacebook ({ id, name, email, facebookId }: SaveFacebookAccountRepository.Params): Promise<SaveFacebookAccountRepository.Result> {
    const userRepo = getRepository(PgUser)
    let requestId: string
    if (id === undefined) {
      const userPg = await userRepo.save({ name, email, facebookId })
      requestId = userPg.id.toString()
    } else {
      await userRepo.update({ id: +id }, { name, facebookId })
      requestId = id
    }
    return { id: requestId }
  }
}
