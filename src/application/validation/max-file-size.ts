import { InvalidSizeFile } from '@/application/errors'
import { Validator } from '@/application/validation'

export class MaxFileSize implements Validator {
  constructor (
    private readonly maxFileSize: number,
    private readonly value: Buffer
  ) {}

  validate (): Error | undefined {
    const fileSizeMax = this.maxFileSize * 1024 * 1024
    if (this.value.length > fileSizeMax) {
      return new InvalidSizeFile()
    }
  }
}
