import { getMockReq, getMockRes } from '@jest-mock/express'
import { RequestHandler, Request, Response, NextFunction } from 'express'
import { mocked } from 'ts-jest/utils'

import multer from 'multer'
import { ServerError } from '@/application/errors'

const multerAdapter: RequestHandler = (req, res, next) => {
  const upload = multer().single('picture')
  upload(req, res, err => {
    res.status(500).json({ error: new ServerError(err).message })
  })
}

jest.mock('multer')

describe('MulterAdapter', () => {
  let uploadSpy: jest.Mock
  let singleSpy: jest.Mock
  let multerSpy: jest.Mock
  let fakeMulter: jest.Mocked<typeof multer>

  let sut: RequestHandler
  let req: Request
  let res: Response
  let next: NextFunction

  beforeAll(() => {
    uploadSpy = jest.fn().mockImplementation(() => {})
    singleSpy = jest.fn().mockImplementation(() => uploadSpy)
    multerSpy = jest.fn().mockImplementation(() => ({ single: singleSpy }))
    fakeMulter = multer as jest.Mocked<typeof multer>
    mocked(fakeMulter).mockImplementation(multerSpy)

    sut = multerAdapter
    req = getMockReq()
    res = getMockRes().res
    next = getMockRes().next
  })
  beforeEach(() => {
    sut(req, res, next)
  })
  it('should call single upload with correct input', () => {
    expect(multerSpy).toHaveBeenCalledWith()
    expect(multerSpy).toHaveBeenCalledTimes(1)
    expect(singleSpy).toHaveBeenCalledWith('picture')
    expect(singleSpy).toHaveBeenCalledTimes(1)
    expect(uploadSpy).toHaveBeenCalledWith(req, res, expect.any(Function))
    expect(uploadSpy).toHaveBeenCalledTimes(1)
  })
  it('should return 500 if upload fails', () => {
    const error = new Error('multer_error')
    uploadSpy.mockImplementationOnce((req, res, next) => next(error))

    sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: new ServerError(error).message })
    expect(res.json).toHaveBeenCalledTimes(1)
  })
})