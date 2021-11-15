import { HttpResponse, ok } from '@/application/helpers'
import { ChangeProfilePicture } from '@/domain/use-cases'
import { Controller } from '@/application/controllers'
import { Validator, ValidationBuilder as Builder } from '@/application/validation'

type HttpRequest = { file?: { buffer: Buffer, mimeType: string }, userId: string }
type Model = { initials?: string, pictureUrl?: string }

export class SavePictureController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  async perform ({ file, userId: id }: HttpRequest): Promise<HttpResponse<Model>> {
    const { initials, pictureUrl } = await this.changeProfilePicture({ id, file })
    return ok({ initials, pictureUrl })
  }

  override buildValidators ({ file }: HttpRequest): Validator [] {
    if (file === undefined) return []
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
