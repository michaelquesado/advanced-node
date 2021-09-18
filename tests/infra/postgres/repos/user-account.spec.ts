import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepository } from '@/infra/postgres/repos/'
import { IBackup } from 'pg-mem'

import { getConnection, getRepository, Repository } from 'typeorm'
import { makeFakeDB } from '@/tests/infra/postgres/mocks/'

describe('PgUserAccountRepository', () => {
  let userRepo: Repository<PgUser>
  let backup: IBackup
  let sut: PgUserAccountRepository

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
    sut = new PgUserAccountRepository()
  })
  describe('load', () => {
    it('should return an account if email exists', async () => {
      await userRepo.save({
        email: 'any_email'
      })

      const account = await sut.load({ email: 'any_email' })
      expect(account).toEqual({ id: '1' })
    })

    it('should return undefined if email dont exists', async () => {
      const account = await sut.load({ email: 'any_email' })
      expect(account).toBeUndefined()
    })
  })
})
