import { RequiredFieldError } from '@/application/errors'
import { HttpResponse, badRequest } from '@/application/helpers'

type HttpRequest = { file: { buffer: Buffer, mimeType: string } }
type Model = Error
class SavePictureController {
  async handle ({ file }: HttpRequest): Promise<HttpResponse<Model> | undefined > {
    if (file === undefined || file === null || file.buffer.length < 1) return badRequest(new RequiredFieldError('file'))
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimeType)) return badRequest(new InvalidMimeTypeError(['jpeg', 'png']))
    return undefined
  }
}

class InvalidMimeTypeError extends Error {
  constructor (allowedTypes: string[]) {
    super(`Unsupported type. Allowed: ${allowedTypes.join(', ')}`)
    this.name = 'InvalidMimeTypeError'
  }
}
describe('SavePictureController', () => {
  let sut: SavePictureController
  let buffer: Buffer
  let mimeType: string
  beforeAll(() => {
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/jpeg'
  })
  beforeEach(() => {
    sut = new SavePictureController()
  })
  it('should return 400 if file is undefined', async () => {
    const httpResponse = await sut.handle({ file: undefined as any })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })
  it('should return 400 if file is null', async () => {
    const httpResponse = await sut.handle({ file: null as any })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })
  it('should return 400 if file is empty', async () => {
    const httpResponse = await sut.handle({ file: { buffer: Buffer.from(''), mimeType } })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })
  it('should return 400 if mimeType is invalid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'invalid' } })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['jpeg', 'png'])
    })
  })
  it('should not return 400 if mimeType is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/png' } })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['jpeg', 'png'])
    })
  })
  it('should not return 400 if mimeType is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpg' } })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['jpeg', 'png'])
    })
  })
  it('should not return 400 if mimeType is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpeg' } })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['jpeg', 'png'])
    })
  })
})
