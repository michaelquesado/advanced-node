import { Controller } from '@/application/controllers'
import { RequestHandler } from 'express'

type Adapter = (controller: Controller) => RequestHandler

export const adaptExpressRoute: Adapter = controller => async (req, res) => {
  const { data, statusCode } = await controller.handle({ ...req.body, ...req.locals })
  if ([200, 204].includes(statusCode)) {
    return res.status(statusCode).json(data)
  }
  return res.status(statusCode).json({ error: data.message })
}
