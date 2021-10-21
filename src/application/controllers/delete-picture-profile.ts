import { ChangeProfilePicture } from '@/domain/use-cases'
import { HttpResponse, noContent } from '@/application/helpers'
import { Controller } from '@/application/controllers'

type HttpRequest = {
  user_id: string
}
export class DeletePictureController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  async perform ({ user_id: id }: HttpRequest): Promise<HttpResponse> {
    await this.changeProfilePicture({ id })
    return noContent()
  }
}
