import { forbiddenError, HttpResponse, ok } from '@/application/helpers'
import { Authorize } from '@/domain/use-cases'
import { RequiredStringValidator } from '@/application/validation'
import { Middleware } from '@/application/middleware'

type HttpRequest = { authorization: string }
type Model = Error | { userId: string }
export class AuthenticationMiddleware implements Middleware {
  constructor (private readonly auth: Authorize) {}

  async handler ({ authorization: token }: HttpRequest): Promise<HttpResponse<Model>> {
    if (!this.validate({ authorization: token })) {
      return forbiddenError()
    }
    try {
      const userId = await this.auth({ token })
      return ok({ userId })
    } catch {
      return forbiddenError()
    }
  }

  private validate ({ authorization: token }: HttpRequest): boolean {
    const error = new RequiredStringValidator(token, 'token').validate()
    return error === undefined
  }
}
