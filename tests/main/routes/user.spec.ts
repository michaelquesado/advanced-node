import { PgUser } from '@/infra/repos/postgres/entities'
import { app } from '@/main/config/app'

import { IBackup } from 'pg-mem'
import request from 'supertest'
import { Repository } from 'typeorm'
import { makeFakeDB } from '@/tests/infra/repos/postgres/mocks'
import { sign } from 'jsonwebtoken'
import { env } from '@/main/config/env'
import { PgConnection } from '@/infra/repos/postgres/helpers'

describe('User Routes', () => {
  let connection: PgConnection
  let userRepo: Repository<PgUser>
  let backup: IBackup

  beforeAll(async () => {
    connection = PgConnection.getInstance()
    const db = await makeFakeDB([PgUser])
    backup = db.backup()
    userRepo = connection.getRepository(PgUser)
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  beforeEach(() => {
    backup.restore()
  })
  describe('DELETE /user/picture', () => {
    it('should return 403 if no header authorization is provided', async () => {
      const { status } = await request(app)
        .delete('/api/user/picture')

      expect(status).toBe(403)
    })
    it('should return 200', async () => {
      const { id } = await userRepo.save({ email: 'any_email', name: 'any name' })
      const authorization = sign({ key: id }, env.secret)
      const { status, body } = await request(app)
        .delete('/api/user/picture')
        .set({ authorization })

      expect(status).toBe(200)
      expect(body).toEqual({ pictureUrl: undefined, initials: 'AN' })
    })
  })
  describe('PUT /user/picture', () => {
    const uploadSpy = jest.fn()

    jest.mock('@/infra/gateways/aws-s3-file-storage', () => ({
      AwsS3FileStorage: jest.fn().mockReturnValue({ upload: uploadSpy })
    }))
    it('should return 403 if no header authorization is provided', async () => {
      const { status } = await request(app)
        .put('/api/user/picture')

      expect(status).toBe(403)
    })
    it('should return 200', async () => {
      uploadSpy.mockResolvedValueOnce('any_url')
      const { id } = await userRepo.save({ email: 'any_email', name: 'any name' })
      const authorization = sign({ key: id }, env.secret)
      const { status, body } = await request(app)
        .put('/api/user/picture')
        .set({ authorization })
        .attach('picture', Buffer.from('any_buffer'), { filename: 'any_name', contentType: 'image/png' })

      expect(status).toBe(200)
      expect(body).toEqual({ pictureUrl: 'any_url', initials: undefined })
    })
  })
})
