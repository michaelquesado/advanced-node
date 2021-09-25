import { Router } from 'express'

export default (router: Router): void => {
  router.post('/api/facebook/login', (req, res) => {
    res.send({ data: 'any' })
  })
}
