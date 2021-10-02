import { forbiddenError, HttpResponse } from '@/application/helpers'
import { ForbiddenError } from '@/application/errors'

type HttpRequest = { authorization: string }
export class AuthenticationMiddleware {
  async handle (request: HttpRequest): Promise<HttpResponse<Error>> {
    return forbiddenError()
  }
}
describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware
  beforeEach(() => {
    sut = new AuthenticationMiddleware()
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
})
