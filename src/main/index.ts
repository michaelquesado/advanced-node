import './config/module-alias'

import 'reflect-metadata'
import { PgConnection } from '@/infra/repos/postgres/helpers'

PgConnection.getInstance().connect().then(async () => {
  const { app } = await import('@/main/config/app')
  app.listen(8000, () => console.log('Server running at http://localhost:8000'))
}).catch(console.error)
