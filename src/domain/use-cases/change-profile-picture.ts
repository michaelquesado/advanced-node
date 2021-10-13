import { UUIDGenerator, UploadFile } from '@/domain/contracts/gateways'
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repos'

type SetupChangeProfilePicture = (fileStorage: UploadFile, uuidGenerator: UUIDGenerator, userProfilePictureRepo: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture
type Input = { id: string, file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>

export const setupChangeProfilePicture: SetupChangeProfilePicture = (fileStorage, uuidGenerator, userProfilePictureRepo) => async input => {
  let pictureUrl: string | undefined
  let initials: string | undefined
  if (input.file !== undefined) {
    pictureUrl = await fileStorage.upload({ file: input.file, key: uuidGenerator.uuid({ key: input.id }) })
  } else {
    const user = await userProfilePictureRepo.load({ id: input.id })
    if (user?.name !== undefined) {
      const letters = user.name.match(/\b(.)/g) ?? []
      if (letters.length > 1) {
        initials = `${letters?.shift()?.toUpperCase() ?? ''}${letters?.pop()?.toUpperCase() ?? ''}`
      } else {
        initials = user.name.substr(0, 2).toUpperCase()
      }
    }
  }
  await userProfilePictureRepo.savePicture({ pictureUrl, initials })
}
