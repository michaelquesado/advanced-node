import { RequiredFieldError } from '@/application/errors'

export class Required {
  constructor (
    readonly value: string,
    readonly field?: string
  ) {}

  validate (): Error | undefined {
    if (this.value === null || this.value === undefined) {
      return new RequiredFieldError(this.field)
    }
  }
}
export class RequiredString extends Required {
  constructor (
    override readonly value: string,
    override readonly field?: string
  ) {
    super(value, field)
  }

  override validate (): Error | undefined {
    if (super.validate() !== undefined || this.value === '') {
      return new RequiredFieldError(this.field)
    }
  }
}
