import { PgUser } from '@/infra/repos/postgres/entities'
import { app } from '@/main/config/app'

import { IBackup } from 'pg-mem'
import request from 'supertest'
import { getConnection } from 'typeorm'
import { makeFakeDB } from '@/../tests/infra/repos/postgres/mocks'

describe('User Routes', () => {
  describe('DELETE /user/picture', () => {
    let backup: IBackup

    beforeAll(async () => {
      const db = await makeFakeDB([PgUser])
      backup = db.backup()
    })

    afterAll(async () => {
      await getConnection().close()
    })

    beforeEach(() => {
      backup.restore()
    })
    it('should return 403 if no header authorization is provided', async () => {
      const { status } = await request(app)
        .post('/api/user/picture')

      expect(status).toBe(403)
    })
  })
})
