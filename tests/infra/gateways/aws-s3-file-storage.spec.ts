import { UploadFile } from '@/domain/contracts/gateways'
import { config, S3 } from 'aws-sdk'
import { mocked } from 'ts-jest/utils'

jest.mock('aws-sdk')
class AwsS3FileStorage implements UploadFile {
  constructor (accessKey: string, secret: string, private readonly bucket: string) {
    config.update({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
  }

  async upload ({ key: Key, file: Body }: UploadFile.Params): Promise<UploadFile.Result> {
    const s3 = new S3()
    await s3.putObject({
      Bucket: this.bucket,
      Key,
      Body,
      ACL: 'public-read'
    }).promise()
    return `https://${this.bucket}.s3.amazonaws.com/${encodeURIComponent(Key)}`
  }
}
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
})
