import { Controller } from '@/application/controllers'
import { RequestHandler } from 'express'

export const adaptExpressRoute = (controller: Controller): RequestHandler => {
  return async (req, res) => {
    const httpResponse = await controller.handle({ ...req.body })
    res
      .status(httpResponse.statusCode)
      .json(httpResponse.data.message !== undefined
        ? { error: httpResponse.data.message }
        : httpResponse.data)
  }
}
