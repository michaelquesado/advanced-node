import { SaveUserPicture } from '@/domain/contracts/repos/'
import { PgUser } from '@/infra/repos/postgres/entities'

import { getRepository } from 'typeorm'

export class PgUserProfileRepository implements SaveUserPicture {
  async savePicture ({ id, pictureUrl, initials }: SaveUserPicture.Params): Promise<void> {
    const userRepo = getRepository(PgUser)
    await userRepo.update({ id: parseInt(id) }, { pictureUrl, initials })
  }
}
