import { InvalidMimeTypeError } from '@/application/errors'

type Extension = 'png' | 'jpeg'

class AllowedMimeTypes {
  constructor (
    private readonly allowed: Extension[],
    private readonly mimeType: string
  ) {}

  validate (): Error {
    return new InvalidMimeTypeError(this.allowed)
  }
}
describe('AllowedMimeTypes', () => {
  it('should return InvalidMimeTypeError if mimeType is invalid', () => {
    const sut = new AllowedMimeTypes(['png'], 'image/jpeg')

    const error = sut.validate()

    expect(error).toEqual(new InvalidMimeTypeError(['png']))
  })
})
