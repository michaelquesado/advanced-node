import { mock, MockProxy } from 'jest-mock-extended'
import { Controller } from '@/application/controllers'
import { DbTransaction } from '@/application/contracts'
import { DbTransactionController } from '@/application/decorators'

describe('DbTransactionController', () => {
  let db: MockProxy<DbTransaction>
  let decoratee: MockProxy<Controller>
  let sut: DbTransactionController

  beforeAll(() => {
    db = mock()
    decoratee = mock()
    decoratee.perform.mockResolvedValue({ statusCode: 204, data: null })
  })
  beforeEach(() => {
    sut = new DbTransactionController(decoratee, db)
  })
  it('should extends Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })
  it('should call open transaction', async () => {
    await sut.perform({ any: 'any' })

    expect(db.openTransaction).toHaveBeenCalledWith()
    expect(db.openTransaction).toHaveBeenCalledTimes(1)
  })
  it('should execute decoratee', async () => {
    await sut.perform({ any: 'any' })

    expect(decoratee.perform).toHaveBeenCalledWith({ any: 'any' })
    expect(decoratee.perform).toHaveBeenCalledTimes(1)
  })
  it('should call commit and closeTransaction', async () => {
    await sut.perform({ any: 'any' })

    expect(db.commit).toHaveBeenCalledWith()
    expect(db.commit).toHaveBeenCalledTimes(1)
    expect(db.closeTransaction).toHaveBeenCalledWith()
    expect(db.closeTransaction).toHaveBeenCalledTimes(1)
  })
  it('should call rollback and closeTransaction on failure', async () => {
    decoratee.perform.mockRejectedValueOnce(new Error('decoratee error'))
    sut.perform({ any: 'any' }).catch(() => {
      expect(db.commit).not.toHaveBeenCalled()
      expect(db.rollback).toHaveBeenCalledWith()
      expect(db.rollback).toHaveBeenCalledTimes(1)
      expect(db.closeTransaction).toHaveBeenCalledWith()
      expect(db.closeTransaction).toHaveBeenCalledTimes(1)
    })
  })
  it('should return same response of decoratee', async () => {
    const response = await sut.perform({ any: 'any' })

    expect(response).toEqual({ statusCode: 204, data: null })
  })
  it('should call re-throw the same error of decoratee', async () => {
    const error = new Error('decoratee error')
    decoratee.perform.mockRejectedValueOnce(error)
    const promise = sut.perform({ any: 'any' })

    await expect(promise).rejects.toThrow(error)
  })
})
