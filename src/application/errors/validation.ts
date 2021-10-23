export class RequiredFieldError extends Error {
  constructor (field?: string) {
    const message = field === undefined
      ? 'Field must be send'
      : `The field ${field} is required`
    super(message)
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
