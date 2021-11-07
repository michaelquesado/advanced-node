import { adaptExpressRoute as adapt } from '@/main/adapters'

import { Router } from 'express'
import { auth } from '@/main/middlewares'
import { makeDeletePictureProfileController } from '@/main/factories/controllers/'

export default (router: Router): void => {
  router.post('/user/picture', auth, adapt(makeDeletePictureProfileController()))
}
