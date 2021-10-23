import { Required, RequiredString, RequiredBuffer } from '@/application/validation'
import { RequiredFieldError } from '@/application/errors'

describe('RequiredString', () => {
  it('should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredString('', 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('should be instance of Required', () => {
    const sut = new RequiredString('', 'any_field')

    expect(sut).toBeInstanceOf(Required)
  })

  it('should return defined message if value is empty and the field too', () => {
    const sut = new RequiredString('')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError())
  })
  it('should return undefined if value is not empty', () => {
    const sut = new RequiredString('any_value', 'any_field')

    const error = sut.validate()

    expect(error).toBe(undefined)
  })
})
describe('RequiredBuffer', () => {
  it('should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredBuffer(Buffer.from(''), 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('should be instance of Required', () => {
    const sut = new RequiredBuffer(Buffer.from(''), 'any_field')

    expect(sut).toBeInstanceOf(Required)
  })

  it('should return undefined if value is not empty', () => {
    const sut = new RequiredBuffer(Buffer.from('any_value'), 'any_field')

    const error = sut.validate()

    expect(error).toBe(undefined)
  })
})

describe('Required', () => {
  it('should return RequiredFieldError if value is null', () => {
    const sut = new Required(null as any, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('should return RequiredFieldError if value is undefined', () => {
    const sut = new Required(undefined as any, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('should return undefined if value is not empty', () => {
    const sut = new Required('any_value', 'any_field')

    const error = sut.validate()

    expect(error).toBe(undefined)
  })
})
