import { PgUser } from '@/infra/repos/postgres/entities'
import { app } from '@/main/config/app'

import { IBackup } from 'pg-mem'
import request from 'supertest'
import { getConnection, getRepository, Repository } from 'typeorm'
import { makeFakeDB } from '@/../tests/infra/repos/postgres/mocks'
import { sign } from 'jsonwebtoken'
import { env } from '@/main/config/env'

describe('User Routes', () => {
  describe('DELETE /user/picture', () => {
    let userRepo: Repository<PgUser>
    let backup: IBackup

    beforeAll(async () => {
      const db = await makeFakeDB([PgUser])
      backup = db.backup()
      userRepo = getRepository(PgUser)
    })

    afterAll(async () => {
      await getConnection().close()
    })

    beforeEach(() => {
      backup.restore()
    })
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
})