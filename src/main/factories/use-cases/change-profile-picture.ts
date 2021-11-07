import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases'
import { makAwsS3FileStorage, makeUUIDHandler } from '@/main/factories/gateways'
import { makePgUserProfileRepository } from '@/main/factories/repos'

export const makeChangeProfilePicture = (): ChangeProfilePicture => {
  return setupChangeProfilePicture(
    makAwsS3FileStorage(),
    makeUUIDHandler(),
    makePgUserProfileRepository()
  )
}
