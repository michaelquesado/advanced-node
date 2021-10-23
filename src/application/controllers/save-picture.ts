import { HttpResponse, ok } from '@/application/helpers'
import { ChangeProfilePicture } from '@/domain/use-cases'
import { Controller } from '@/application/controllers'
import { Validator, ValidationBuilder as Builder } from '../validation'

type HttpRequest = { file: { buffer: Buffer, mimeType: string }, userId: string }
type Model = Error | { initials?: string, pictureUrl?: string }

export class SavePictureController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  async perform ({ file, userId: id }: HttpRequest): Promise<HttpResponse<Model>> {
    const data = await this.changeProfilePicture({ id, file: file.buffer })
    return ok(data)
  }

  override buildValidators ({ file }: HttpRequest): Validator [] {
    return [
      ...Builder.of({ value: file, fieldName: 'file' })
        .required()
        .requiredBuffer()
        .allowedMimeTypes({ allowed: ['png', 'jpg', 'jpeg'], mimeType: file.mimeType })
        .maxFileSize(5)
        .build()
    ]
  }
}
