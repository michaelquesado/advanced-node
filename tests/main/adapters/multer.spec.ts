import { getMockReq, getMockRes } from '@jest-mock/express'
import { RequestHandler, Request, Response, NextFunction } from 'express'
import { mocked } from 'ts-jest/utils'

import multer from 'multer'

const multerAdapter: RequestHandler = (req, res, next) => {
  const upload = multer().single('picture')
  upload(req, res, () => {})
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
    uploadSpy = jest.fn()
    singleSpy = jest.fn().mockImplementationOnce(() => uploadSpy)
    multerSpy = jest.fn().mockImplementationOnce(() => ({ single: singleSpy }))
    fakeMulter = multer as jest.Mocked<typeof multer>
    mocked(fakeMulter).mockImplementationOnce(multerSpy)

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
})
