import { InvalidMimeTypeError } from '@/application/errors'

type Extension = 'png' | 'jpeg'

class AllowedMimeTypes {
  constructor (
    private readonly allowed: Extension[],
    private readonly mimeType: string
  ) {}

  validate (): Error | undefined {
    const [, type] = this.mimeType.split('/')
    if (!this.allowed.includes(type as Extension)) return new InvalidMimeTypeError(this.allowed)
  }
}

describe('AllowedMimeTypes', () => {
  it('should return InvalidMimeTypeError if mimeType is invalid', () => {
    const sut = new AllowedMimeTypes(['png'], 'image/jpeg')

    const error = sut.validate()

    expect(error).toEqual(new InvalidMimeTypeError(['png']))
  })
  it('should return undefined if mimeType is valid', () => {
    const sut = new AllowedMimeTypes(['png'], 'image/png')

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
  it('should return InvalidMimeTypeError if mimeType is invalid', () => {
    const sut = new AllowedMimeTypes(['jpeg'], 'image/png')

    const error = sut.validate()

    expect(error).toEqual(new InvalidMimeTypeError(['jpeg']))
  })
  it('should return undefined if mimeType is valid', () => {
    const sut = new AllowedMimeTypes(['jpeg'], 'image/jpeg')

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
