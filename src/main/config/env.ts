export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '393100252427628',
    clientSecret: process.env.FB_CLIENT_SECRET ?? '653bb4c2e367cd9c67515cb9e3131c97'
  },
  secret: process.env.SECRET ?? 'jkahda1oiudy9s',
  s3: {
    accessKey: process.env.S3_ACCESS_KEY ?? 'any_access_key',
    secret: process.env.S3_SECRET ?? 'any_secret',
    bucket: process.env.S3_BUCKET ?? 'any_bucket'
  }
}
