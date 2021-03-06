import { Controller } from '@/application/controllers'
import { NextFunction, Request, RequestHandler, Response } from 'express'

import { getMockReq, getMockRes } from '@jest-mock/express'
import { mock, MockProxy } from 'jest-mock-extended'
import { adaptExpressRoute } from '@/main/adapters'

describe('ExpressRouter', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let controller: MockProxy<Controller>
  let sut: RequestHandler

  beforeAll(() => {
    req = getMockReq({ body: { anyBody: 'anyBody' }, locals: { anyLocals: 'anyLocals' } })
    res = getMockRes().res
    next = getMockRes().next
    controller = mock()
    controller.handle.mockResolvedValue({ statusCode: 200, data: { data: 'any_data' } })
  })
  beforeEach(() => {
    sut = adaptExpressRoute(controller)
  })
  it('should call handle with correct request', async () => {
    await sut(req, res, next)

    expect(controller.handle).toHaveBeenCalledWith({ anyBody: 'anyBody', anyLocals: 'anyLocals' })
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })
  it('should respond 200 if handle return 200', async () => {
    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ data: 'any_data' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })
  it('should respond 204 if handle returns a statusCode 204', async () => {
    controller.handle.mockResolvedValueOnce({
      statusCode: 204,
      data: null
    })
    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(204)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith(null)
    expect(res.json).toHaveBeenCalledTimes(1)
  })
  it('should respond 400 if handle returns a statusCode 400', async () => {
    controller.handle.mockResolvedValueOnce({
      statusCode: 400,
      data: new Error('any_error')
    })
    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })
  it('should respond 500 if handle returns a statusCode 500', async () => {
    controller.handle.mockResolvedValueOnce({
      statusCode: 500,
      data: new Error('any_error')
    })
    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })
})
