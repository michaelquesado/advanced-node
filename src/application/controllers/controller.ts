import { badRequest, HttpResponse, serverError } from '@/application/helpers'
import { ValidationComposite, Validator } from '../validation'

export abstract class Controller {
  abstract perform (httpRequest: any): Promise<HttpResponse>

  buildValidators (httpRequest: any): Validator[] {
    return []
  }

  async handle (httpRequest: any): Promise<HttpResponse<any>> {
    const errors = this.validate(httpRequest)
    if (errors !== undefined) {
      return badRequest(errors)
    }
    try {
      return await this.perform(httpRequest)
    } catch (error: any) {
      return serverError(error)
    }
  }

  private validate (httpRequest: any): Error | undefined {
    return new ValidationComposite(this.buildValidators(httpRequest)).validate()
  }
}
