export class ServerError extends Error {
  constructor (error?: Error) {
    super('Server failed. Try again soon ')
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}
export class RequiredFieldError extends Error {
  constructor (field: string) {
    super(`The field ${field} is required`)
    this.name = 'RequiredFieldError'
  }
}
export class UnauthorizedError extends Error {
  constructor () {
    super()
    this.name = 'UnauthorizedError'
  }
}
