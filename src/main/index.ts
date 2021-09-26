import './config/module-alias'

import 'reflect-metadata'
import { app } from '@/main/config/app'
import { createConnections } from 'typeorm'

createConnections()
  .then(() => app.listen(8000, () => console.log('Server running at http://localhost:8000')))
  .catch(console.error)
