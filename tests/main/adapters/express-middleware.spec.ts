import { HttpResponse } from '@/application/helpers'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { RequestHandler } from 'express'
import { mock } from 'jest-mock-extended'

type Setup = (middleware: Middleware) => RequestHandler
const setupMiddlewareAdapter: Setup = middleware => async (req, res, next) => {
  await middleware.handler({ ...req.headers })
}

interface Middleware {
  handler: (httpRequest: any) => HttpResponse
}

describe('ExpressMiddleware', () => {
  it('should call handle with correct value', async () => {
    const middleware = mock<Middleware>()
    const req = getMockReq({ headers: { any: 'any' } })
    const res = getMockRes().res
    const next = getMockRes().next
    const sut = setupMiddlewareAdapter(middleware)

    await sut(req, res, next)

    expect(middleware.handler).toHaveBeenCalledWith({ any: 'any' })
  })
})
