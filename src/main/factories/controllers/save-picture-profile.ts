import { SavePictureController } from '@/application/controllers'
import { makeChangeProfilePicture } from '@/main/factories/use-cases'

export const makeSavePictureProfileController = (): SavePictureController => {
  return new SavePictureController(makeChangeProfilePicture())
}
