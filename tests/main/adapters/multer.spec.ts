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
  it('should call single upload with correct input', () => {
    const uploadSpy = jest.fn()
    const singleSpy = jest.fn().mockImplementationOnce(() => uploadSpy)
    const multerSpy = jest.fn().mockImplementationOnce(() => ({ single: singleSpy }))
    const fakeMulter = multer as jest.Mocked<typeof multer>
    mocked(fakeMulter).mockImplementationOnce(multerSpy)

    const sut = multerAdapter
    const req: Request = getMockReq()
    const res: Response = getMockRes().res
    const next: NextFunction = getMockRes().next

    sut(req, res, next)

    expect(multerSpy).toHaveBeenCalledWith()
    expect(multerSpy).toHaveBeenCalledTimes(1)
    expect(singleSpy).toHaveBeenCalledWith('picture')
    expect(singleSpy).toHaveBeenCalledTimes(1)
    expect(uploadSpy).toHaveBeenCalledWith(req, res, expect.any(Function))
    expect(uploadSpy).toHaveBeenCalledTimes(1)
  })
})
