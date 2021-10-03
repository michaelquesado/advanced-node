import { ForbiddenError } from '@/application/errors'
import { app } from '@/main/config/app'

import request from 'supertest'
import { auth } from '@/main/middlewares'

describe('Authentication Middleware', () => {
  it('should return 403 if authorization header was not provided', async () => {
    app.get('/fake_endpoint', auth, (req, res) => {
      return res.json(req.locals)
    })
    const { status, body } = await request(app)
      .get('/fake_endpoint')

    expect(status).toBe(403)
    expect(body.error).toBe(new ForbiddenError().message)
  })
})
