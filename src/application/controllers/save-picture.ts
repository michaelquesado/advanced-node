import { RequiredFieldError, InvalidMimeTypeError, InvalidSizeFile } from '@/application/errors'
import { HttpResponse, badRequest, ok } from '@/application/helpers'
import { ChangeProfilePicture } from '@/domain/use-cases'
import { Controller } from '@/application/controllers'

type HttpRequest = { file: { buffer: Buffer, mimeType: string }, userId: string }
type Model = Error | { initials?: string, pictureUrl?: string }

export class SavePictureController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  async perform ({ file, userId: id }: HttpRequest): Promise<HttpResponse<Model>> {
    if (file === undefined || file === null || file.buffer.length < 1) return badRequest(new RequiredFieldError('file'))
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimeType)) return badRequest(new InvalidMimeTypeError(['jpeg', 'png']))
    if (file.buffer.length > 5 * 1024 * 1024) return badRequest(new InvalidSizeFile())
    const data = await this.changeProfilePicture({ id, file: file.buffer })
    return ok(data)
  }
}
