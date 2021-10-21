import { ChangeProfilePicture } from '@/domain/use-cases'
import { HttpResponse, noContent } from '@/application/helpers'
import { Controller } from '@/application/controllers'

type HttpRequest = {
  user_id: string
}
class DeletePictureController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  async perform ({ user_id: id }: HttpRequest): Promise<HttpResponse> {
    await this.changeProfilePicture({ id })
    return noContent()
  }
}

describe('DeletePictureController', () => {
  let changeProfilePicture: jest.Mock
  let sut: DeletePictureController
  beforeAll(() => {
    changeProfilePicture = jest.fn()
  })
  beforeEach(() => {
    sut = new DeletePictureController(changeProfilePicture)
  })
  it('should call ChangeProfilePicture with correct input', async () => {
    await sut.handle({ user_id: 'any_user_id' })

    expect(changeProfilePicture).toHaveBeenCalledWith({ id: 'any_user_id' })
    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
  })
  it('should return 204', async () => {
    const httpResponse = await sut.handle({ user_id: 'any_user_id' })

    expect(httpResponse).toEqual({
      statusCode: 204,
      data: undefined
    })
  })
  it('should return 204', async () => {
    const httpResponse = await sut.handle({ user_id: 'any_user_id' })

    expect(httpResponse).toEqual({
      statusCode: 204,
      data: undefined
    })
  })
  it('should extends Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })
})
