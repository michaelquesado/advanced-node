import './config/module-alias'

import 'reflect-metadata'
import { app } from '@/main/config/app'
import { createConnections } from 'typeorm'
import { config } from '@/infra/postgres/helpers'

createConnections([config])
  .then(() => app.listen(8000, () => console.log('Server running at http://localhost:8000')))
  .catch(console.error)
