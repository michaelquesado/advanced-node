import { mock, MockProxy } from 'jest-mock-extended'

interface Validator {
  validate: () => undefined | Error
}
class ValidationComposite implements Validator {
  constructor (private readonly validators: Validator[]) {}

  validate (): undefined | Error {
    for (const validator of this.validators) {
      const error = validator.validate()
      if (error !== undefined) {
        return error
      }
    }
  }
}
describe('ValidationComposite', () => {
  let sut: ValidationComposite
  let validator1: MockProxy<Validator>
  let validator2: MockProxy<Validator>
  let validators: Validator[]

  beforeAll(() => {
    validator1 = mock()
    validator1.validate.mockReturnValue(undefined)
    validator2 = mock()
    validator2.validate.mockReturnValue(undefined)
    validators = [validator1, validator2]
  })
  beforeEach(() => {
    sut = new ValidationComposite(validators)
  })
  it('should returns undefined if all Validators returns undefined', () => {
    const error = sut.validate()

    expect(error).toBeUndefined()
  })

  it('should return the first error', () => {
    validator1.validate.mockReturnValue(new Error('error_1'))
    validator2.validate.mockReturnValue(new Error('error_2'))
    const error = sut.validate()

    expect(error).toEqual(new Error('error_1'))
  })
})
