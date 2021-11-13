import { mocked } from 'ts-jest/utils'
import { createConnection, getConnectionManager } from 'typeorm'

jest.mock('typeorm', () => ({
  Entity: jest.fn(),
  Column: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  createConnection: jest.fn(),
  getConnectionManager: jest.fn()
}))
class PgConnection {
  private static instance?: PgConnection
  private constructor () {}

  public static getInstance (): PgConnection {
    if (this.instance === undefined) {
      this.instance = new PgConnection()
    }
    return this.instance
  }

  public async connect (): Promise<void> {
    const connection = await createConnection()
    connection.createQueryRunner()
  }
}
describe('PgConnection', () => {
  it('should have only one instance', () => {
    const sut = PgConnection.getInstance()
    const sut2 = PgConnection.getInstance()

    expect(sut).toBe(sut2)
  })
  it('should create a new connection', async () => {
    const sut = PgConnection.getInstance()
    const getConnectionManagerSpy = jest.fn().mockReturnValueOnce({
      has: jest.fn().mockReturnValueOnce(false)
    })
    mocked(getConnectionManager).mockImplementationOnce(getConnectionManagerSpy)
    const createQueryRunnerSpy = jest.fn()
    const createConnectionSpy = jest.fn().mockResolvedValueOnce({
      createQueryRunner: createQueryRunnerSpy
    })
    mocked(createConnection).mockImplementationOnce(createConnectionSpy)
    await sut.connect()

    expect(createConnectionSpy).toHaveBeenCalledWith()
    expect(createConnectionSpy).toHaveBeenCalledTimes(1)
    expect(createQueryRunnerSpy).toHaveBeenCalledWith()
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1)
  })
})
