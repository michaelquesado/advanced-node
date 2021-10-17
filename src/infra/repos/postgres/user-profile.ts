import { SaveUserPicture, LoadUserProfile } from '@/domain/contracts/repos/'
import { PgUser } from '@/infra/repos/postgres/entities'

import { getRepository } from 'typeorm'

export class PgUserProfileRepository implements SaveUserPicture, LoadUserProfile {
  async savePicture ({ id, pictureUrl, initials }: SaveUserPicture.Params): Promise<void> {
    const userRepo = getRepository(PgUser)
    await userRepo.update({ id: parseInt(id) }, { pictureUrl, initials })
  }

  async load ({ id }: LoadUserProfile.Params): Promise<LoadUserProfile.Result> {
    const userRepo = getRepository(PgUser)
    const userPg = await userRepo.findOne({ id: parseInt(id) })
    if (userPg !== undefined) {
      return {
        name: userPg.name
      }
    }
    return undefined
  }
}