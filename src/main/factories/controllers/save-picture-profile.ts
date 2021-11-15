import { SavePictureController, Controller } from '@/application/controllers'
import { makeChangeProfilePicture } from '@/main/factories/use-cases'
import { makeDbTransactionController } from '../decorators'

export const makeSavePictureProfileController = (): Controller => {
  const controller = new SavePictureController(makeChangeProfilePicture())
  return makeDbTransactionController(controller)
}
