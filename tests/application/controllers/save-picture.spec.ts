import { SavePictureController, Controller } from '@/application/controllers'
import { RequiredFieldError, InvalidMimeTypeError, InvalidSizeFile } from '@/application/errors'

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
  it('should return 400 if file is undefined', async () => {
    const httpResponse = await sut.handle({ file: undefined as any, userId })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })
  it('should return 400 if file is null', async () => {
    const httpResponse = await sut.handle({ file: null as any, userId })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })
  it('should return 400 if file is empty', async () => {
    const httpResponse = await sut.handle({ file: { buffer: Buffer.from(''), mimeType }, userId })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })
  it('should return 400 if mimeType is invalid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'invalid' }, userId })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['jpeg', 'png'])
    })
  })
  it('should not return 400 if mimeType is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/png' }, userId })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['jpeg', 'png'])
    })
  })
  it('should not return 400 if mimeType is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpg' }, userId })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['jpeg', 'png'])
    })
  })
  it('should not return 400 if mimeType is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpeg' }, userId })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['jpeg', 'png'])
    })
  })
  it('should return 400 if file size is bigger then 5mb', async () => {
    const httpResponse = await sut.handle({
      file: {
        buffer: Buffer.from(new ArrayBuffer(6 * 1024 * 1024)),
        mimeType
      },
      userId
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new InvalidSizeFile()
    })
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
