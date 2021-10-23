import { InvalidSizeFile } from '@/application/errors'
import { MaxFileSize } from '@/application/validation'

describe('MaxFileSize', () => {
  it('should return InvalidMimeTypeError if mimeType is invalid', () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024))
    const sut = new MaxFileSize(5, invalidBuffer)

    const error = sut.validate()

    expect(error).toEqual(new InvalidSizeFile())
  })
  it('should return undefined if mimeType is valid', () => {
    const validBuffer = Buffer.from(new ArrayBuffer(5 * 1024 * 1024))
    const sut = new MaxFileSize(5, validBuffer)

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
  it('should return undefined if mimeType is valid', () => {
    const validBuffer = Buffer.from(new ArrayBuffer(4 * 1024 * 1024))
    const sut = new MaxFileSize(4, validBuffer)

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
