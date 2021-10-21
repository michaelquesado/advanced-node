import { RequiredFieldError } from '@/application/errors'
import { HttpResponse, badRequest } from '@/application/helpers'
import { ChangeProfilePicture } from '@/domain/use-cases'

type HttpRequest = { file: { buffer: Buffer, mimeType: string }, userId: string }
type Model = Error
class SavePictureController {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {}

  async handle ({ file, userId: id }: HttpRequest): Promise<HttpResponse<Model> | undefined > {
    if (file === undefined || file === null || file.buffer.length < 1) return badRequest(new RequiredFieldError('file'))
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimeType)) return badRequest(new InvalidMimeTypeError(['jpeg', 'png']))
    if (file.buffer.length > 5 * 1024 * 1024) return badRequest(new InvalidSizeFile())
    await this.changeProfilePicture({ id, file: file.buffer })
    return undefined
  }
}

class InvalidMimeTypeError extends Error {
  constructor (allowedTypes: string[]) {
    super(`Unsupported type. Allowed: ${allowedTypes.join(', ')}`)
    this.name = 'InvalidMimeTypeError'
  }
}
class InvalidSizeFile extends Error {
  constructor () {
    super('Invalid size file')
    this.name = 'InvalidSizeFile'
  }
}
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
    changeProfilePicture = jest.fn()
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
})
