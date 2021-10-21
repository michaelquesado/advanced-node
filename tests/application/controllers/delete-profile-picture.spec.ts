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
  it('should call ChangeProfilePicture with correct input', async () => {
    const changeProfilePicture = jest.fn()
    const sut = new DeletePictureController(changeProfilePicture)

    await sut.handle({ user_id: 'any_user_id' })

    expect(changeProfilePicture).toHaveBeenCalledWith({ id: 'any_user_id' })
    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
  })
})
