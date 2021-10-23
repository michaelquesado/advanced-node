import { InvalidMimeTypeError } from '@/application/errors'
import { AllowedMimeTypes } from '@/application/validation'

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
  it('should return undefined if mimeType is valid', () => {
    const sut = new AllowedMimeTypes(['jpg'], 'image/jpg')

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
  it('should return InvalidMimeTypeError if mimeType is invalid', () => {
    const sut = new AllowedMimeTypes(['jpg'], 'image/png')

    const error = sut.validate()

    expect(error).toEqual(new InvalidMimeTypeError(['jpg']))
  })
})
