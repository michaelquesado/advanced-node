import { HttpResponse, ok } from '@/application/helpers'
import { ChangeProfilePicture } from '@/domain/use-cases'
import { Controller } from '@/application/controllers'
import { AllowedMimeTypes, MaxFileSize, Required, RequiredBuffer, Validator } from '../validation'

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
      new Required(file, 'file'),
      new RequiredBuffer(file.buffer),
      new AllowedMimeTypes(['png', 'jpg', 'jpeg'], file.mimeType),
      new MaxFileSize(5, file.buffer)]
  }
}
