import { UUIDGenerator, UploadFile } from '@/domain/contracts/gateways'

type SetupChangeProfilePicture = (fileStorage: UploadFile, uuidGenerator: UUIDGenerator) => ChangeProfilePicture
type Input = { id: string, file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>

export const setupChangeProfilePicture: SetupChangeProfilePicture = (fileStorage, uuidGenerator) => async input => {
  if (input.file !== undefined) {
    await fileStorage.upload({ file: input.file, key: uuidGenerator.uuid({ key: input.id }) })
  }
}
