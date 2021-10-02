import { forbiddenError, HttpResponse } from '@/application/helpers'
import { ForbiddenError } from '@/application/errors'
import { Authorize } from '@/domain/use-cases'
import { RequiredStringValidator } from '@/application/validation'

type HttpRequest = { authorization: string }
export class AuthenticationMiddleware {
  constructor (private readonly auth: Authorize) {}

  async handle ({ authorization: token }: HttpRequest): Promise<HttpResponse<Error> | undefined > {
    const error = new RequiredStringValidator(token, 'token').validate()
    if (error !== undefined) {
      return forbiddenError()
    }
    await this.auth({ token })
  }
}
describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware
  let authorization: string
  let authorize: jest.Mock

  beforeEach(() => {
    authorization = 'any_authorization_token'
    authorize = jest.fn()
    sut = new AuthenticationMiddleware(authorize)
  })

  it('should return 403 if authorization is empty ', async () => {
    const httpResponse = await sut.handle({ authorization: '' })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })
  it('should return 403 if authorization is null ', async () => {
    const httpResponse = await sut.handle({ authorization: null as any })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })
  it('should return 403 if authorization is undefined ', async () => {
    const httpResponse = await sut.handle({ authorization: undefined as any })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })
  it('should call Authorize with correct input ', async () => {
    await sut.handle({ authorization })

    expect(authorize).toHaveBeenCalledWith({ token: authorization })
    expect(authorize).toHaveBeenCalledTimes(1)
  })
})
