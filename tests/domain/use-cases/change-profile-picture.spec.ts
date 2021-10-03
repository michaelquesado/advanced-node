import { mock } from 'jest-mock-extended'

interface UploadFile {
  upload: (input: UploadFile.Params) => Promise<void>
}
namespace UploadFile {
  export type Params = {
    key: string
    file: Buffer
  }
}
interface UUIDGenerator {
  uuid: (input: UUIDGenerator.Params) => UUIDGenerator.Output
}
namespace UUIDGenerator {
  export type Params = {
    key: string
  }
  export type Output = string
}
type Setup = (fileStorage: UploadFile, uuidGenerator: UUIDGenerator) => ChangeProfilePicture
type Input = { id: string, file: Buffer }
type ChangeProfilePicture = (input: Input) => Promise<void>

const setupChangeProfilePicture: Setup = (fileStorage, uuidGenerator) => async input => {
  await fileStorage.upload({ file: input.file, key: uuidGenerator.uuid({ key: input.id }) })
}

describe('ChangeProfilePicture', () => {
  it('should call UploadFile with correct input', async () => {
    const uuid = 'any_random_id'
    const file = Buffer.from('any_buffer')
    const fileStorage = mock<UploadFile>()
    const uuidGenerator = mock<UUIDGenerator>()
    uuidGenerator.uuid.mockReturnValue(uuid)

    const sut = setupChangeProfilePicture(fileStorage, uuidGenerator)

    await sut({ id: uuid, file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
