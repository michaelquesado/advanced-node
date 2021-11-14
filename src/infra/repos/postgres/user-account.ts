import { LoadUserAccount, SaveFacebookAccount } from '@/domain/contracts/repos/'
import { PgUser } from '@/infra/repos/postgres/entities'
import { PgRepository } from '@/infra/repos/postgres'

export class PgUserAccountRepository extends PgRepository implements LoadUserAccount, SaveFacebookAccount {
  async load ({ email }: LoadUserAccount.Params): Promise<LoadUserAccount.Result> {
    const userRepo = this.getRepository(PgUser)
    const pgUser = await userRepo.findOne({ email })
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }

  async saveWithFacebook ({ id, name, email, facebookId }: SaveFacebookAccount.Params): Promise<SaveFacebookAccount.Result> {
    const userRepo = this.getRepository(PgUser)
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
