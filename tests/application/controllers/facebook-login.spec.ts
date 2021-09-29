import { AuthenticationError } from '@/domain/entities/errors'
import { FacebookLoginController } from '@/application/controllers'
import { unauthorized } from '@/application/helpers'
import { RequiredStringValidator } from '@/application/validation'

describe('FacebookLoginController', () => {
  let facebookAuth: jest.Mock
  let sut: FacebookLoginController

  beforeAll(() => {
    facebookAuth = jest.fn()
  })
  beforeEach(() => {
    facebookAuth.mockResolvedValue({ accessToken: 'any_value' })
    sut = new FacebookLoginController(facebookAuth)
  })

  it('should return 400 if validation fails', async () => {
    const validators = sut.buildValidators({ token: 'any_token' })

    expect(validators).toEqual([
      new RequiredStringValidator('any_token', 'token')
    ])
  })

  it('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token: 'any_token' })

    expect(facebookAuth).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookAuth).toHaveBeenCalledTimes(1)
  })

  it('should return 401 if authentication fails', async () => {
    facebookAuth.mockRejectedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual(unauthorized())
  })

  it('should return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    })
  })
})
