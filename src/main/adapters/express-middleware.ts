import { Middleware } from '@/application/middleware'
import { RequestHandler } from 'express'

type Setup = (middleware: Middleware) => RequestHandler

export const setupMiddlewareAdapter: Setup = middleware => async (req, res, next) => {
  const { data, statusCode } = await middleware.handler({ ...req.headers })
  if (statusCode === 200) {
    const entries = Object.entries(data).filter(entry => entry[1])
    req.locals = { ...req.locals, ...Object.fromEntries(entries) }
    return next()
  }
  res.status(statusCode).json({ error: data.message })
}
