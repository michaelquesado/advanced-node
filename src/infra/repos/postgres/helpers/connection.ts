import { Connection, createConnection, getConnection, getConnectionManager, getRepository, ObjectType, QueryRunner, Repository } from 'typeorm'
import { ConnectionNotFoundError, TransactionNotFoundError } from '@/infra/repos/postgres/helpers'

export class PgConnection {
  private static instance?: PgConnection
  private queryRunner?: QueryRunner
  private connection?: Connection
  private constructor () {}

  public static getInstance (): PgConnection {
    if (this.instance === undefined) {
      this.instance = new PgConnection()
    }
    return this.instance
  }

  public async connect (): Promise<void> {
    if (getConnectionManager().has('default')) {
      this.connection = getConnection()
    } else {
      this.connection = await createConnection()
    }
  }

  public async disconnect (): Promise<void> {
    if (this.connection === undefined) throw new ConnectionNotFoundError()
    await getConnection().close()
    this.queryRunner = undefined
    this.connection = undefined
  }

  public async openTransaction (): Promise<void> {
    if (this.connection === undefined) throw new ConnectionNotFoundError()
    this.queryRunner = this.connection.createQueryRunner()
    await this.queryRunner.startTransaction()
  }

  public async closeTransaction (): Promise<void> {
    if (this.queryRunner === undefined) throw new TransactionNotFoundError()
    await this.queryRunner.release()
  }

  public async commit (): Promise<void> {
    if (this.queryRunner === undefined) throw new TransactionNotFoundError()
    await this.queryRunner.commitTransaction()
  }

  public async rollback (): Promise<void> {
    if (this.queryRunner === undefined) throw new TransactionNotFoundError()
    await this.queryRunner.rollbackTransaction()
  }

  public getRepository<Entity>(entity: ObjectType<Entity>): Repository<Entity> {
    if (this.connection === undefined) throw new ConnectionNotFoundError()
    if (this.queryRunner !== undefined) return this.queryRunner.manager.getRepository(entity)
    return getRepository(entity)
  }
}
