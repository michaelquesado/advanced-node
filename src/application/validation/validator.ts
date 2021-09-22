export interface Validator {
  validate: () => undefined | Error
}
