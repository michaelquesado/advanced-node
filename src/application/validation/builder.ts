import { AllowedMimeTypes, Extension, MaxFileSize, Required, RequiredBuffer, RequiredString, Validator } from '@/application/validation'

export class ValidationBuilder {
  private constructor (
    private readonly value: any,
    private readonly fieldName?: string,
    private readonly validators: Validator [] = []
  ) {}

  static of (params: { value: any, fieldName?: string}): ValidationBuilder {
    return new ValidationBuilder(params.value, params.fieldName)
  }

  required (): ValidationBuilder {
    this.validators.push(new Required(this.value, this.fieldName))
    return this
  }

  requiredBuffer (): ValidationBuilder {
    this.validators.push(new RequiredBuffer(this.value.buffer, this.fieldName))
    return this
  }

  allowedMimeTypes ({ allowed, mimeType }: { allowed: Extension[], mimeType: string }): ValidationBuilder {
    this.validators.push(new AllowedMimeTypes(allowed, mimeType))
    return this
  }

  maxFileSize (maxSizeFile: number): ValidationBuilder {
    this.validators.push(new MaxFileSize(maxSizeFile, this.value.buffer))
    return this
  }

  requiredString (): ValidationBuilder {
    this.validators.push(new RequiredString(this.value, this.fieldName))
    return this
  }

  build (): Validator[] {
    return this.validators
  }
}
