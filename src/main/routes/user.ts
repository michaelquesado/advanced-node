import { Router } from 'express'
import { auth } from '@/main/middlewares'

export default (router: Router): void => {
  router.post('/user/picture', auth)
}
