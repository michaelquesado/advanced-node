import { PgUser } from '@/infra/repos/postgres/entities'
import { PgUserProfileRepository } from '@/infra/repos/postgres'
import { IBackup } from 'pg-mem'

import { getConnection, getRepository, Repository } from 'typeorm'
import { makeFakeDB } from '@/../tests/infra/repos/postgres/mocks'

describe('PgUserProfileRepository', () => {
  let userRepo: Repository<PgUser>
  let backup: IBackup
  let sut: PgUserProfileRepository

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
    sut = new PgUserProfileRepository()
  })
  describe('savePicture', () => {
    it('should return an account if email exists', async () => {
      const { id } = await userRepo.save({ email: 'any_email', initials: 'any_initials' })

      await sut.savePicture({
        id: id.toString(),
        pictureUrl: 'any_url'
      })

      const userPg = await userRepo.findOne({ id })

      expect(userPg).toMatchObject({
        id,
        initials: null,
        pictureUrl: 'any_url'
      })
    })
  })
  describe('load', () => {
    it('should return a name if user profile exists', async () => {
      const { id } = await userRepo.save({ email: 'any_email', name: 'any_name' })

      const userPg = await sut.load({ id: id.toString() })

      expect(userPg?.name).toBe('any_name')
    })
    it('should return a name undefined', async () => {
      const { id } = await userRepo.save({ email: 'any_email' })

      const userPg = await sut.load({ id: id.toString() })

      expect(userPg?.name).toBeUndefined()
    })
    it('should return undefined if user profile does not exists', async () => {
      const userPg = await sut.load({ id: '1' })

      expect(userPg?.name).toBeUndefined()
    })
  })
})
