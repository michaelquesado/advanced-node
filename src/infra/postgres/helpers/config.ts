import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

export const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  username: 'root',
  password: 'h4ck3v1m2',
  database: 'advanced',
  port: 54320,
  entities: ['dist/infra/postgres/entities/index.js']
}
