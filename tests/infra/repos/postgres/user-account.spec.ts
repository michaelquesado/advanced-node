import { PgUser } from '@/infra/repos/postgres/entities'
import { PgUserAccountRepository } from '@/infra/repos/postgres'
import { IBackup } from 'pg-mem'

import { getConnection, getRepository, Repository } from 'typeorm'
import { makeFakeDB } from '@/../tests/infra/repos/postgres/mocks'

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

  describe('SaveWithFacebook', () => {
    it('should create an account if id is undefined', async () => {
      const { id } = await sut.saveWithFacebook({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id'
      })

      const userPg = await userRepo.findOne({
        email: 'any_email'
      })

      expect(userPg?.id).toBe(1)
      expect(id).toBe('1')
    })
    it('should update an account if id is defined', async () => {
      await userRepo.save({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id'
      })

      const { id } = await sut.saveWithFacebook({
        id: '1',
        email: 'new_email',
        name: 'new_name',
        facebookId: 'new_fb_id'
      })

      const userPg = await userRepo.findOne({
        id: 1
      })

      expect(userPg).toMatchObject({
        id: 1,
        email: 'any_email',
        name: 'new_name',
        facebookId: 'new_fb_id'
      })
      expect(id).toBe('1')
    })
  })
})
