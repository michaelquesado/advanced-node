import { RequiredFieldError } from '@/application/errors'
import { HttpResponse, badRequest } from '@/application/helpers'

type HttpRequest = { file: any }
type Model = Error

class SavePictureController {
  async handle ({ file }: HttpRequest): Promise<HttpResponse<Model>> {
    return badRequest(new RequiredFieldError('file'))
  }
}
describe('SavePictureController', () => {
  it('should return 400 if file is undefined', async () => {
    const sut = new SavePictureController()

    const httpResponse = await sut.handle({ file: undefined })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })
})
