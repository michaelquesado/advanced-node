import { forbiddenError, HttpResponse, ok } from '@/application/helpers'
import { ForbiddenError } from '@/application/errors'
import { Authorize } from '@/domain/use-cases'
import { RequiredStringValidator } from '@/application/validation'

type HttpRequest = { authorization: string }
type Model = Error | { userId: string }
export class AuthenticationMiddleware {
  constructor (private readonly auth: Authorize) {}

  async handle ({ authorization: token }: HttpRequest): Promise<HttpResponse<Model>> {
    const error = new RequiredStringValidator(token, 'token').validate()
    if (error !== undefined) {
      return forbiddenError()
    }
    try {
      const userId = await this.auth({ token })
      return ok({ userId })
    } catch {
      return forbiddenError()
    }
  }
}
describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware
  let authorization: string
  let authorize: jest.Mock

  beforeEach(() => {
    sut = new AuthenticationMiddleware(authorize)
  })

  beforeAll(() => {
    authorization = 'any_authorization_token'
    authorize = jest.fn().mockResolvedValue('any_user_id')
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
  it('should return 403 if Authorize throws', async () => {
    authorize.mockRejectedValueOnce(new Error('authorize_error'))
    const httpResponse = await sut.handle({ authorization })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })
  it('should return 200 with userId on success', async () => {
    const httpResponse = await sut.handle({ authorization })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { userId: 'any_user_id' }
    })
  })
})
