import { Controller } from '@/application/controllers'
import { RequestHandler } from 'express'

type Adapter = (controller: Controller) => RequestHandler

export const adaptExpressRoute: Adapter = controller => async (req, res) => {
  const { data, statusCode } = await controller.handle({ ...req.body })
  res
    .status(statusCode)
    .json(data.message !== undefined
      ? { error: data.message }
      : data)
}
