import { Connection, createConnection, getConnection, getConnectionManager, QueryRunner } from 'typeorm'
import { ConnectionNotFoundError } from '@/infra/repos/postgres/helpers'

export class PgConnection {
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
