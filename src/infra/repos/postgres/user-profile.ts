import { SaveUserPicture, LoadUserProfile } from '@/domain/contracts/repos/'
import { PgUser } from '@/infra/repos/postgres/entities'
import { PgRepository } from '@/infra/repos/postgres/'

export class PgUserProfileRepository extends PgRepository implements SaveUserPicture, LoadUserProfile {
  async savePicture ({ id, pictureUrl, initials }: SaveUserPicture.Params): Promise<void> {
    const userRepo = this.getRepository(PgUser)
    await userRepo.update({ id: parseInt(id) }, { pictureUrl, initials })
  }

  async load ({ id }: LoadUserProfile.Params): Promise<LoadUserProfile.Result> {
    const userRepo = this.getRepository(PgUser)
    const userPg = await userRepo.findOne({ where: { id: parseInt(id) } })
    if (userPg !== undefined) {
      return {
        name: userPg.name ?? undefined
      }
    }
    return undefined
  }
}
