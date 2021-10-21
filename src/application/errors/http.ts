export class ServerError extends Error {
  constructor (error?: Error) {
    super('Server failed. Try again soon ')
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}
export class UnauthorizedError extends Error {
  constructor () {
    super()
    this.name = 'UnauthorizedError'
  }
}
export class ForbiddenError extends Error {
  constructor () {
    super()
    this.name = 'ForbiddenError'
  }
}
