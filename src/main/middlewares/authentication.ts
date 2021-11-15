import { setupMiddlewareAdapter } from '@/main/adapters'
import { makeAuthenticationMiddleware } from '@/main/factories/middlewares'

export const auth = setupMiddlewareAdapter(makeAuthenticationMiddleware())
