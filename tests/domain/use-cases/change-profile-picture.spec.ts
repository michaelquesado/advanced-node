import { mock, MockProxy } from 'jest-mock-extended'

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
type SetupChangeProfilePicture = (fileStorage: UploadFile, uuidGenerator: UUIDGenerator) => ChangeProfilePicture
type Input = { id: string, file: Buffer }
type ChangeProfilePicture = (input: Input) => Promise<void>

const setupChangeProfilePicture: SetupChangeProfilePicture = (fileStorage, uuidGenerator) => async input => {
  await fileStorage.upload({ file: input.file, key: uuidGenerator.uuid({ key: input.id }) })
}

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<UploadFile>
  let uuidGenerator: MockProxy<UUIDGenerator>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_random_id'
    file = Buffer.from('any_buffer')
    fileStorage = mock()
    uuidGenerator = mock()
    uuidGenerator.uuid.mockReturnValue(uuid)
  })
  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, uuidGenerator)
  })
  it('should call UploadFile with correct input', async () => {
    await sut({ id: uuid, file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
