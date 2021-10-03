import { setupMiddlewareAdapter } from '@/main/adapters'
import { makeAuthenticationMiddleware } from '../factories/middlewares'

export const auth = setupMiddlewareAdapter(makeAuthenticationMiddleware())
