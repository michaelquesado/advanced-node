import { adaptExpressRoute as adapt } from '@/main/adapters'

import { Router } from 'express'
import { auth } from '@/main/middlewares'
import { makeSavePictureProfileController } from '@/main/factories/controllers/'

export default (router: Router): void => {
  router.delete('/user/picture', auth, adapt(makeSavePictureProfileController()))
}
