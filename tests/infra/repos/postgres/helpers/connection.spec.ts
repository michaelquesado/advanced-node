import { mocked } from 'ts-jest/utils'
import { Connection, createConnection, getConnection, getConnectionManager, QueryRunner } from 'typeorm'

jest.mock('typeorm', () => ({
  Entity: jest.fn(),
  Column: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  createConnection: jest.fn(),
  getConnectionManager: jest.fn(),
  getConnection: jest.fn()
}))
class PgConnection {
  private static instance?: PgConnection
  private queryRunner?: QueryRunner
  private constructor () {}

  public static getInstance (): PgConnection {
    if (this.instance === undefined) {
      this.instance = new PgConnection()
    }
    return this.instance
  }

  public async connect (): Promise<void> {
    let connection: Connection
    if (getConnectionManager().has('default')) {
      connection = getConnection()
    } else {
      connection = await createConnection()
    }
    this.queryRunner = connection.createQueryRunner()
  }

  public async disconnect (): Promise<void> {
    if (this.queryRunner === undefined) throw new ConnectionNotFoundError()
    await getConnection().close()
    this.queryRunner = undefined
  }
}
class ConnectionNotFoundError extends Error {
  constructor () {
    super()
    this.message = 'Connection not found'
    this.name = 'ConnectionNotFoundError'
  }
}
describe('PgConnection', () => {
  let getConnectionManagerSpy: jest.Mock
  let createQueryRunnerSpy: jest.Mock
  let createConnectionSpy: jest.Mock
  let hasSpy: jest.Mock
  let closeSpy: jest.Mock
  let getConnectionSpy: jest.Mock
  let sut: PgConnection

  beforeEach(() => {
    hasSpy = jest.fn().mockReturnValue(true)
    getConnectionManagerSpy = jest.fn().mockReturnValue({
      has: hasSpy
    })
    mocked(getConnectionManager).mockImplementation(getConnectionManagerSpy)
    createQueryRunnerSpy = jest.fn().mockReturnValue({})
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
})
