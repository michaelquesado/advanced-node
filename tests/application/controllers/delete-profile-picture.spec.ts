import { ChangeProfilePicture } from '@/domain/use-cases'

type HttpRequest = {
  user_id: string
}
class DeletePictureController {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {}

  async handle ({ user_id: id }: HttpRequest): Promise<void> {
    await this.changeProfilePicture({ id })
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
})
