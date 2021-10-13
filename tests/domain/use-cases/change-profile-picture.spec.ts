import { mock, MockProxy } from 'jest-mock-extended'
import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways'
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases'
import { SaveUserPicture, LoadUserProfile } from '@/domain/contracts/repos'
import { mocked } from 'ts-jest/utils'
import { UserProfile } from '@/domain/entities/user-profile'

jest.mock('@/domain/entities/user-profile')
describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<UploadFile>
  let uuidGenerator: MockProxy<UUIDGenerator>
  let userProfileRepo: MockProxy<SaveUserPicture & LoadUserProfile>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_random_id'
    file = Buffer.from('any_buffer')
    fileStorage = mock()
    fileStorage.upload.mockResolvedValue('any_url')
    uuidGenerator = mock()
    userProfileRepo = mock()
    userProfileRepo.load.mockResolvedValue({ name: 'Michael da Silva Quesado' })
    uuidGenerator.uuid.mockReturnValue(uuid)
  })
  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, uuidGenerator, userProfileRepo)
  })
  it('should call UploadFile with correct input', async () => {
    await sut({ id: uuid, file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
  it('should not call UploadFile when file is undefined', async () => {
    await sut({ id: uuid, file: undefined })

    expect(fileStorage.upload).not.toHaveBeenCalled()
  })
  it('should call SaveUserPicture with correct input', async () => {
    await sut({ id: uuid, file })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith(...mocked(UserProfile).mock.instances)
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })
  it('should call LoadUserProfile with correct input', async () => {
    await sut({ id: uuid, file: undefined })

    expect(userProfileRepo.load).toHaveBeenCalledWith({ id: uuid })
    expect(userProfileRepo.load).toHaveBeenCalledTimes(1)
  })
  it('should not call LoadUserProfile if file exists', async () => {
    await sut({ id: uuid, file })

    expect(userProfileRepo.load).not.toHaveBeenCalled()
  })
})
