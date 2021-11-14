import { PgUser } from '@/infra/repos/postgres/entities'
import { UnauthorizedError } from '@/application/errors'
import { app } from '@/main/config/app'

import { IBackup } from 'pg-mem'
import request from 'supertest'
import { makeFakeDB } from '@/../tests/infra/repos/postgres/mocks'
import { PgConnection } from '@/infra/repos/postgres/helpers'

describe('Login Routes', () => {
  describe('POST /login/facebook', () => {
    let backup: IBackup
    let connection: PgConnection
    const loadUserSpy = jest.fn()

    jest.mock('@/infra/gateways/facebook-api', () => ({
      FacebookApi: jest.fn().mockReturnValue({ loadUser: loadUserSpy })
    }))

    beforeAll(async () => {
      connection = PgConnection.getInstance()
      const db = await makeFakeDB([PgUser])
      backup = db.backup()
    })

    afterAll(async () => {
      await connection.disconnect()
    })

    beforeEach(() => {
      backup.restore()
    })
    it('should return 200 with AccessToken', async () => {
      loadUserSpy.mockResolvedValueOnce({
        facebookId: 'any_id',
        name: 'any_name',
        email: 'any_email'
      })
      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' })

      expect(status).toBe(200)
      expect(body).toBeDefined()
    })
    it('should return 400 with UnauthorizedError', async () => {
      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'invalid_token' })

      expect(status).toBe(401)
      expect(body.error).toBe(new UnauthorizedError().message)
    })
  })
})
