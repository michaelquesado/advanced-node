import { AwsS3FileStorage } from '@/infra/gateways'
import { env } from '@/main/config/env'

export const makAwsS3FileStorage = (): AwsS3FileStorage => {
  return new AwsS3FileStorage(
    env.s3.accessKey,
    env.s3.secret,
    env.s3.bucket
  )
}
