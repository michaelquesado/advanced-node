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
type Setup = (fileStorage: UploadFile) => ChangeProfilePicture
type Input = { id: string, file: Buffer }
type ChangeProfilePicture = (input: Input) => Promise<void>

const setupChangeProfilePicture: Setup = fileStorage => async input => {
  await fileStorage.upload({ file: input.file, key: input.id })
}

describe('ChangeProfilePicture', () => {
  it('should call UploadFile with correct input', async () => {
    const file = Buffer.from('any_buffer')
    const fileStorage = mock<UploadFile>()
    const sut = setupChangeProfilePicture(fileStorage)

    await sut({ id: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: 'any_id' })
  })
})
