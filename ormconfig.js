module.exports = {
  type: 'postgres',
  host: 'localhost',
  username: 'root',
  password: 'h4ck3v1m2',
  database: 'advanced',
  port: 54320,
  entities: [`${process.env.TS_NODE_DEV === undefined ? 'dist' : 'src'}/infra/repos/postgres/entities/index.{js,ts}`]
}
