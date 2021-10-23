import { InvalidMimeTypeError } from '@/application/errors'
import { Validator } from '@/application/validation'

export type Extension = 'png' | 'jpeg' | 'jpg'

export class AllowedMimeTypes implements Validator {
  constructor (
    private readonly allowed: Extension[],
    private readonly mimeType: string
  ) {}

  validate (): Error | undefined {
    const [, type] = this.mimeType.split('/')
    if (!this.allowed.includes(type as Extension)) {
      return new InvalidMimeTypeError(this.allowed)
    }
  }
}
