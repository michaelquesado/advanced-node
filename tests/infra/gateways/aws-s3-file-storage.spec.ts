import { config, S3 } from 'aws-sdk'
import { mocked } from 'ts-jest/utils'
import { AwsS3FileStorage } from '@/infra/gateways'

jest.mock('aws-sdk')

describe('AwsS3FileStorage', () => {
  let sut: AwsS3FileStorage
  let accessKey: string
  let secret: string
  let key: string
  let bucket: string
  let file: Buffer
  let putObjectPromiseSpy: jest.Mock
  let putObjectSpy: jest.Mock
  beforeAll(() => {
    accessKey = 'any_access_key'
    secret = 'any_secret'
    key = 'any_key'
    bucket = 'any_bucket'
    file = Buffer.from('any_buffer')
    putObjectPromiseSpy = jest.fn()
    putObjectSpy = jest.fn().mockImplementation(() => ({ promise: putObjectPromiseSpy }))
    mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({
      putObject: putObjectSpy
    })))
  })
  beforeEach(() => {
    sut = new AwsS3FileStorage(accessKey, secret, bucket)
  })
  it('should config aws credentials on creation', () => {
    expect(sut).toBeDefined()
    expect(config.update).toHaveBeenCalledWith({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
    expect(config.update).toHaveBeenCalledTimes(1)
  })
  it('should call putObject with correct input', async () => {
    await sut.upload({ key, file })

    expect(putObjectSpy).toHaveBeenCalledWith({
      Bucket: bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    })
    expect(putObjectSpy).toHaveBeenCalledTimes(1)
    expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1)
  })
  it('should return imageUrl', async () => {
    const urlImage = await sut.upload({ key, file })

    expect(urlImage).toBe(`https://${bucket}.s3.amazonaws.com/${key}`)
  })
  it('should return encoded imageUrl', async () => {
    const urlImage = await sut.upload({ key: 'any key', file })

    expect(urlImage).toBe(`https://${bucket}.s3.amazonaws.com/any%20key`)
  })
  it('should rethrow if putObject throws', async () => {
    const error = new Error('upload_error')
    putObjectPromiseSpy.mockRejectedValueOnce(error)
    const promise = sut.upload({ key: 'any key', file })

    await expect(promise).rejects.toThrow(error)
  })
})
