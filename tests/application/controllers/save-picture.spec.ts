import { SavePictureController, Controller } from '@/application/controllers'
import { AllowedMimeTypes, MaxFileSize, Required, RequiredBuffer } from '@/application/validation'

describe('SavePictureController', () => {
  let sut: SavePictureController
  let buffer: Buffer
  let mimeType: string
  let userId: string
  let file: { buffer: Buffer, mimeType: string }
  let changeProfilePicture: jest.Mock

  beforeAll(() => {
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/jpeg'
    userId = 'any_id'
    file = { buffer, mimeType }
    changeProfilePicture = jest.fn().mockResolvedValue({ initials: 'any_initials', pictureUrl: 'any_url' })
  })
  beforeEach(() => {
    sut = new SavePictureController(changeProfilePicture)
  })
  it('should return 400 if validation fails', async () => {
    const validators = sut.buildValidators({ file, userId })

    expect(validators).toEqual([
      new Required(file, 'file'),
      new RequiredBuffer(buffer),
      new AllowedMimeTypes(['png', 'jpg', 'jpeg'], mimeType),
      new MaxFileSize(5, buffer)
    ])
  })
  it('should call ChangeProfilePicture with correct inputs', async () => {
    await sut.handle({
      file, userId
    })

    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
    expect(changeProfilePicture).toHaveBeenCalledWith({ id: userId, file: buffer })
  })
  it('should return 200 with valid data', async () => {
    const response = await sut.handle({
      file, userId
    })

    expect(response).toEqual({
      statusCode: 200,
      data: { initials: 'any_initials', pictureUrl: 'any_url' }
    })
  })
  it('should extends Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })
})
