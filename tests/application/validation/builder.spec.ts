import {
  AllowedMimeTypes,
  MaxFileSize,
  Required,
  RequiredBuffer,
  RequiredString,
  ValidationBuilder
} from '@/application/validation'

describe('ValidationBuilder', () => {
  it('should return a RequiredString', () => {
    const validators = ValidationBuilder
      .of({ value: 'any_value', fieldName: 'any_field' })
      .requiredString()
      .build()

    expect(validators).toEqual([new RequiredString('any_value', 'any_field')])
  })
  it('should return a Required', () => {
    const validators = ValidationBuilder
      .of({ value: 'any_value', fieldName: 'any_field' })
      .required()
      .build()

    expect(validators).toEqual([new Required('any_value', 'any_field')])
  })
  it('should return a requiredBuffer', () => {
    const buffer = Buffer.from('any_value')

    const validators = ValidationBuilder
      .of({ value: { buffer }, fieldName: 'any_field' })
      .requiredBuffer()
      .build()

    expect(validators).toEqual([new RequiredBuffer(buffer, 'any_field')])
  })
  it('should return a allowedMimeTypes', () => {
    const buffer = Buffer.from('any_value')

    const validators = ValidationBuilder
      .of({ value: { buffer }, fieldName: 'any_field' })
      .allowedMimeTypes({ allowed: ['jpeg'], mimeType: 'image/jpeg' })
      .build()

    expect(validators).toEqual([new AllowedMimeTypes(['jpeg'], 'image/jpeg')])
  })
  it('should return a maxFileSize', () => {
    const buffer = Buffer.from('any_value')

    const validators = ValidationBuilder
      .of({ value: { buffer }, fieldName: 'any_field' })
      .maxFileSize(5)
      .build()

    expect(validators).toEqual([new MaxFileSize(5, buffer)])
  })
})
