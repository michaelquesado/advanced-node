import { mock, MockProxy } from 'jest-mock-extended'
import { UploadFile, UUIDGenerator, DeleteFile } from '@/domain/contracts/gateways'
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases'
import { SaveUserPicture, LoadUserProfile } from '@/domain/contracts/repos'
import { mocked } from 'ts-jest/utils'
import { UserProfile } from '@/domain/entities/user-profile'

jest.mock('@/domain/entities/user-profile')
describe('ChangeProfilePicture', () => {
  let uuid: string
  let buffer: Buffer
  let mimeType: string
  let file: { buffer: Buffer, mimeType: string }
  let fileStorage: MockProxy<UploadFile & DeleteFile>
  let uuidGenerator: MockProxy<UUIDGenerator>
  let userProfileRepo: MockProxy<SaveUserPicture & LoadUserProfile>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_random_id'
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/png'
    file = { buffer, mimeType }
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
    await sut({ id: uuid, file: { buffer, mimeType: 'image/png' } })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file: buffer, fileName: `${uuid}.png` })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
  it('should call UploadFile with correct input', async () => {
    await sut({ id: uuid, file: { buffer, mimeType: 'image/jpeg' } })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file: buffer, fileName: `${uuid}.jpeg` })
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
  it('should call SaveUserPicture with correct input', async () => {
    userProfileRepo.load.mockResolvedValueOnce(undefined)
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
  it('should return correct data on success', async () => {
    mocked(UserProfile).mockImplementationOnce(id => ({
      setPicture: jest.fn(),
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: 'any_initials'
    }))

    const result = await sut({ id: uuid, file })

    expect(result).toMatchObject({
      pictureUrl: 'any_url',
      initials: 'any_initials'
    })
  })
  it('should call DeleteFile when file exists and SaveUserPicture throws', async () => {
    userProfileRepo.savePicture.mockRejectedValueOnce(new Error())
    const promise = sut({ id: uuid, file })
    expect.assertions(2)

    promise.catch(() => {
      expect(fileStorage.delete).toHaveBeenCalledWith({ fileName: uuid })
      expect(fileStorage.delete).toHaveBeenCalledTimes(1)
    })
  })
  it('should not call DeleteFile when file does not exists and SaveUserPicture throws', async () => {
    userProfileRepo.savePicture.mockRejectedValueOnce(new Error())
    const promise = sut({ id: uuid, file: undefined })
    expect.assertions(1)

    promise.catch(() => {
      expect(fileStorage.delete).not.toHaveBeenCalled()
    })
  })
  it('should rethrow if SaveUserPicture throws', async () => {
    const error = new Error('save_error')

    userProfileRepo.savePicture.mockRejectedValueOnce(error)
    const promise = sut({ id: uuid, file: undefined })

    await expect(promise).rejects.toThrow(error)
  })
})
