import { Controller } from '@/application/controllers'
import { RequestHandler } from 'express'

export const adaptExpressRoute = (controller: Controller): RequestHandler => {
  return async (req, res) => {
    const { data, statusCode } = await controller.handle({ ...req.body })
    res
      .status(statusCode)
      .json(data.message !== undefined
        ? { error: data.message }
        : data)
  }
}
