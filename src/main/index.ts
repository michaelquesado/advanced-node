import './config/module-alias'

import 'reflect-metadata'
import { createConnection, getConnectionOptions } from 'typeorm'

getConnectionOptions().then(async options => {
  const root = process.env.TS_NODE_DEV === undefined ? 'dist' : 'src'
  const entities = [`${root}/infra/repos/postgres/entities/index.{js,ts}`]
  await createConnection({ ...options, entities })
  console.log({ ...options, entities })
  const { app } = await import('@/main/config/app')
  app.listen(8000, () => console.log('Server running at http://localhost:8000'))
}).catch(console.error)
