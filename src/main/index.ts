import './config/module-alias'

import 'reflect-metadata'
import { app } from '@/main/config/app'

app.listen(8000, () => console.log('Server running at http://localhost:8000'))
