import { UUIDGenerator, UploadFile } from '@/domain/contracts/gateways'
import { UserProfilePicture } from '@/domain/contracts/repos'

type SetupChangeProfilePicture = (fileStorage: UploadFile, uuidGenerator: UUIDGenerator, userProfilePictureRepo: UserProfilePicture) => ChangeProfilePicture
type Input = { id: string, file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>

export const setupChangeProfilePicture: SetupChangeProfilePicture = (fileStorage, uuidGenerator, userProfilePictureRepo) => async input => {
  if (input.file !== undefined) {
    const pictureUrl = await fileStorage.upload({ file: input.file, key: uuidGenerator.uuid({ key: input.id }) })
    await userProfilePictureRepo.save({ pictureUrl })
  }
}
