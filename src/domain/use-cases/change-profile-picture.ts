import { UserProfile } from '@/domain/entities/user-profile'
import { UUIDGenerator, UploadFile } from '@/domain/contracts/gateways'
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repos'

type SetupChangeProfilePicture = (fileStorage: UploadFile, uuidGenerator: UUIDGenerator, userProfilePictureRepo: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture
type Input = { id: string, file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>

export const setupChangeProfilePicture: SetupChangeProfilePicture = (fileStorage, uuidGenerator, userProfilePictureRepo) => async input => {
  const data: { pictureUrl?: string, name?: string} = {}
  if (input.file !== undefined) {
    data.pictureUrl = await fileStorage.upload({ file: input.file, key: uuidGenerator.uuid({ key: input.id }) })
  } else {
    data.name = (await userProfilePictureRepo.load({ id: input.id }))?.name
  }
  const userProfile = new UserProfile(input.id)
  userProfile.setPicture(data)
  await userProfilePictureRepo.savePicture(userProfile)
}
