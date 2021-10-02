import { HttpResponse } from '@/application/helpers'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { RequestHandler, Request, Response, NextFunction } from 'express'
import { mock, MockProxy } from 'jest-mock-extended'

type Setup = (middleware: Middleware) => RequestHandler
const setupMiddlewareAdapter: Setup = middleware => async (req, res, next) => {
  const { data, statusCode } = await middleware.handler({ ...req.headers })
  res.status(statusCode).json(data)
}

interface Middleware {
  handler: (httpRequest: any) => Promise<HttpResponse>
}

describe('ExpressMiddleware', () => {
  let middleware: MockProxy<Middleware>
  let req: Request
  let res: Response
  let next: NextFunction
  let sut: RequestHandler

  beforeAll(() => {
    middleware = mock()
    middleware.handler.mockResolvedValue({
      statusCode: 500,
      data: { error: 'any_error' }
    })

    req = getMockReq({ headers: { any: 'any' } })
    res = getMockRes().res
    next = getMockRes().next
  })

  beforeEach(() => {
    sut = setupMiddlewareAdapter(middleware)
  })

  it('should call handle with correct value', async () => {
    await sut(req, res, next)

    expect(middleware.handler).toHaveBeenCalledWith({ any: 'any' })
    expect(middleware.handler).toHaveBeenCalledTimes(1)
  })

  it('should call handle with empty value', async () => {
    req = getMockReq({ headers: {} })

    await sut(req, res, next)

    expect(middleware.handler).toHaveBeenCalledWith({})
    expect(middleware.handler).toHaveBeenCalledTimes(1)
  })

  it('should respond with correct error and statusCode', async () => {
    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })
})
