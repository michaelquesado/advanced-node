import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { badRequest, HttpResponse, serverError, unauthorized, ok } from '@/application/helpers'
import { ValidationBuilder, ValidationComposite } from '../validation'

type HttpRequest = {
  token: string
}
type Model = Error | {
  accessToken: string
}
export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const errors = this.validate(httpRequest)
      if (errors !== undefined) {
        return badRequest(errors)
      }
      const accessToken = await this.facebookAuthentication.perform({ token: httpRequest.token })
      if (accessToken instanceof AccessToken) {
        return ok({
          accessToken: accessToken.value
        })
      }
      return unauthorized()
    } catch (error: any) {
      return serverError(error)
    }
  }

  private validate (httpRequest: HttpRequest): Error | undefined {
    const validatorsToken = ValidationBuilder
      .of({ value: httpRequest.token, fieldName: 'token' })
      .required()
      .build()
    return new ValidationComposite([
      ...validatorsToken
    ]).validate()
  }
}
