import { RequiredString, ValidationBuilder } from '@/application/validation'

describe('ValidationBuilder', () => {
  it('should return a RequiredString', () => {
    const validators = ValidationBuilder
      .of({ value: 'any_value', fieldName: 'any_field' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredString('any_value', 'any_field')])
  })
})
