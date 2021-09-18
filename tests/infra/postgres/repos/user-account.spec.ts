import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepository } from '@/infra/postgres/repos/'
import { IBackup, IMemoryDb, newDb } from 'pg-mem'

import { getConnection, getRepository, Repository } from 'typeorm'

const makeFakeDB = async (entities?: any[]): Promise<IMemoryDb> => {
  const db = newDb()
  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infra/postgres/entities/index.ts']
  })
  await connection.synchronize()
  return db
}
describe('PgUserAccountRepository', () => {
  describe('load', () => {
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
