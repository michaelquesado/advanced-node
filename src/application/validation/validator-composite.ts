import { Validator } from '@/application/validation'

export class ValidationComposite implements Validator {
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
