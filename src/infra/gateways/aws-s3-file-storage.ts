import { DeleteFile, UploadFile } from '@/domain/contracts/gateways'
import { config, S3 } from 'aws-sdk'

export class AwsS3FileStorage implements UploadFile, DeleteFile {
  constructor (accessKey: string, secret: string, private readonly bucket: string) {
    config.update({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
  }

  async upload ({ fileName: Key, file: Body }: UploadFile.Params): Promise<UploadFile.Result> {
    const s3 = new S3()
    await s3.putObject({
      Bucket: this.bucket,
      Key,
      Body,
      ACL: 'public-read'
    }).promise()
    return `https://${this.bucket}.s3.amazonaws.com/${encodeURIComponent(Key)}`
  }

  async delete ({ fileName: Key }: DeleteFile.Params): Promise<void> {
    const s3 = new S3()
    await s3.deleteObject({
      Bucket: this.bucket,
      Key
    }).promise()
  }
}
