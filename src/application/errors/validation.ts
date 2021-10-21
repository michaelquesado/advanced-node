export class RequiredFieldError extends Error {
  constructor (field: string) {
    super(`The field ${field} is required`)
    this.name = 'RequiredFieldError'
  }
}

export class InvalidMimeTypeError extends Error {
  constructor (allowedTypes: string[]) {
    super(`Unsupported type. Allowed: ${allowedTypes.join(', ')}`)
    this.name = 'InvalidMimeTypeError'
  }
}
export class InvalidSizeFile extends Error {
  constructor () {
    super('Invalid size file')
    this.name = 'InvalidSizeFile'
  }
}
