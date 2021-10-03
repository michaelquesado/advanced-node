import { UUIDGenerator, UploadFile } from '@/domain/contracts/gateways'
import { SaveUserPicture } from '@/domain/contracts/repos'

type SetupChangeProfilePicture = (fileStorage: UploadFile, uuidGenerator: UUIDGenerator, userProfilePictureRepo: SaveUserPicture) => ChangeProfilePicture
type Input = { id: string, file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>

export const setupChangeProfilePicture: SetupChangeProfilePicture = (fileStorage, uuidGenerator, userProfilePictureRepo) => async input => {
  let pictureUrl: string | undefined
  if (input.file !== undefined) {
    pictureUrl = await fileStorage.upload({ file: input.file, key: uuidGenerator.uuid({ key: input.id }) })
  }
  await userProfilePictureRepo.savePicture({ pictureUrl })
}
