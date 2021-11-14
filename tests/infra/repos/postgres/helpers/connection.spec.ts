import { mocked } from 'ts-jest/utils'
import { createConnection, getConnection, getConnectionManager } from 'typeorm'
import { PgConnection, ConnectionNotFoundError } from '@/infra/repos/postgres/helpers'
import { PgUser } from '@/infra/repos/postgres/entities'

jest.mock('typeorm', () => ({
  Entity: jest.fn(),
  Column: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  createConnection: jest.fn(),
  getConnectionManager: jest.fn(),
  getConnection: jest.fn()
}))

describe('PgConnection', () => {
  let getConnectionManagerSpy: jest.Mock
  let createQueryRunnerSpy: jest.Mock
  let createConnectionSpy: jest.Mock
  let hasSpy: jest.Mock
  let closeSpy: jest.Mock
  let startTransactionSpy: jest.Mock
  let releaseSpy: jest.Mock
  let commitSpy: jest.Mock
  let rollbackSpy: jest.Mock
  let getRepositorySpy: jest.Mock
  let getConnectionSpy: jest.Mock
  let sut: PgConnection

  beforeEach(() => {
    hasSpy = jest.fn().mockReturnValue(true)
    getConnectionManagerSpy = jest.fn().mockReturnValue({
      has: hasSpy
    })
    mocked(getConnectionManager).mockImplementation(getConnectionManagerSpy)
    startTransactionSpy = jest.fn()
    releaseSpy = jest.fn()
    commitSpy = jest.fn()
    rollbackSpy = jest.fn()
    getRepositorySpy = jest.fn()
    createQueryRunnerSpy = jest.fn().mockReturnValue({
      startTransaction: startTransactionSpy,
      release: releaseSpy,
      commitTransaction: commitSpy,
      rollbackTransaction: rollbackSpy,
      manager: { getRepository: getRepositorySpy }
    })
    createConnectionSpy = jest.fn().mockResolvedValue({
      createQueryRunner: createQueryRunnerSpy
    })
    mocked(createConnection).mockImplementation(createConnectionSpy)
    closeSpy = jest.fn()
    getConnectionSpy = jest.fn().mockReturnValue({
      createQueryRunner: createQueryRunnerSpy,
      close: closeSpy
    })
    mocked(getConnection).mockImplementation(getConnectionSpy)
  })
  beforeEach(() => {
    sut = PgConnection.getInstance()
  })
  it('should have only one instance', () => {
    const sut2 = PgConnection.getInstance()

    expect(sut).toBe(sut2)
  })
  it('should create a new connection', async () => {
    hasSpy.mockReturnValueOnce(false)
    await sut.connect()

    expect(createConnectionSpy).toHaveBeenCalledWith()
    expect(createConnectionSpy).toHaveBeenCalledTimes(1)
    expect(createQueryRunnerSpy).toHaveBeenCalledWith()
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1)
  })
  it('should return a existent connection', async () => {
    await sut.connect()

    expect(getConnectionManager).toHaveBeenCalledWith()
    expect(getConnectionManager).toHaveBeenCalledTimes(1)
    expect(createQueryRunnerSpy).toHaveBeenCalledWith()
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1)
  })
  it('should close connection', async () => {
    await sut.connect()
    await sut.disconnect()

    expect(closeSpy).toHaveBeenCalledWith()
    expect(closeSpy).toHaveBeenCalledTimes(1)
  })
  it('should return ConnectionNotFoundError on disconnect if connection is not found', async () => {
    const promise = sut.disconnect()

    expect(closeSpy).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
  })
  it('should open transaction', async () => {
    await sut.connect()
    await sut.openTransaction()

    expect(startTransactionSpy).toHaveBeenCalledWith()
    expect(startTransactionSpy).toHaveBeenCalledTimes(1)
    await sut.disconnect()
  })
  it('should return ConnectionNotFoundError on openTransaction if connection is not found', async () => {
    const promise = sut.openTransaction()

    expect(startTransactionSpy).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
  })
  it('should close transaction', async () => {
    await sut.connect()
    await sut.closeTransaction()

    expect(releaseSpy).toHaveBeenCalledWith()
    expect(releaseSpy).toHaveBeenCalledTimes(1)
    await sut.disconnect()
  })
  it('should return ConnectionNotFoundError on closeTransaction if connection is not found', async () => {
    const promise = sut.openTransaction()

    expect(releaseSpy).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
  })
  it('should commit transaction', async () => {
    await sut.connect()
    await sut.commit()

    expect(commitSpy).toHaveBeenCalledWith()
    expect(commitSpy).toHaveBeenCalledTimes(1)
    await sut.disconnect()
  })
  it('should return ConnectionNotFoundError on commit if connection is not found', async () => {
    const promise = sut.commit()

    expect(commitSpy).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
  })
  it('should rollback transaction', async () => {
    await sut.connect()
    await sut.rollback()

    expect(rollbackSpy).toHaveBeenCalledWith()
    expect(rollbackSpy).toHaveBeenCalledTimes(1)
    await sut.disconnect()
  })
  it('should return ConnectionNotFoundError on rollback if connection is not found', async () => {
    const promise = sut.rollback()

    expect(rollbackSpy).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
  })
  it('should getRepository', async () => {
    await sut.connect()
    sut.getRepository(PgUser)

    expect(getRepositorySpy).toHaveBeenCalledWith(PgUser)
    expect(getRepositorySpy).toHaveBeenCalledTimes(1)
    await sut.disconnect()
  })
  it('should return ConnectionNotFoundError on getRepository if connection is not found', async () => {
    expect(getRepositorySpy).not.toHaveBeenCalled()
    expect(() => sut.getRepository(PgUser)).toThrow(new ConnectionNotFoundError())
  })
})
