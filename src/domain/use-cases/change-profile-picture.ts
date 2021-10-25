import { UserProfile } from '@/domain/entities/user-profile'
import { UUIDGenerator, UploadFile, DeleteFile } from '@/domain/contracts/gateways'
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repos'

type SetupChangeProfilePicture = (fileStorage: UploadFile & DeleteFile, uuidGenerator: UUIDGenerator, userProfilePictureRepo: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture
type Input = { id: string, file?: { buffer: Buffer, mimeType: string } }
type Output = { pictureUrl?: string, name?: string }
export type ChangeProfilePicture = (input: Input) => Promise<Output>

export const setupChangeProfilePicture: SetupChangeProfilePicture = (fileStorage, uuidGenerator, userProfilePictureRepo) => async input => {
  const data: { pictureUrl?: string, name?: string } = {}
  const key = uuidGenerator.uuid({ key: input.id })
  if (input.file !== undefined) {
    const [, type] = input.file.mimeType.split('/')
    data.pictureUrl = await fileStorage.upload({ file: input.file.buffer, fileName: `${key}.${type}` })
  } else {
    data.name = (await userProfilePictureRepo.load({ id: input.id }))?.name
  }
  const userProfile = new UserProfile(input.id)
  userProfile.setPicture(data)
  try {
    await userProfilePictureRepo.savePicture(userProfile)
  } catch (e) {
    if (input.file !== undefined) await fileStorage.delete({ fileName: key })
    throw e
  }
  return userProfile
}
