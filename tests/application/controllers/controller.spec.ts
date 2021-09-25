import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'
import { ValidationComposite } from '@/application/validation'
import { mocked } from 'ts-jest/utils'
import { ServerError } from '@/application/errors'

jest.mock('@/application/validation/validator-composite')

class ControllerStun extends Controller {
  result: HttpResponse = {
    statusCode: 200,
    data: 'any_data'
  }

  async perform (httpRequest: any): Promise<HttpResponse> {
    return this.result
  }
}
describe('FacebookLoginController', () => {
  let sut: ControllerStun

  beforeEach(() => {
    sut = new ControllerStun()
  })

  it('should return 400 if validation fails', async () => {
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    mocked(ValidationComposite).mockImplementationOnce(ValidationCompositeSpy)

    const httpResponse = await sut.handle('any_data')

    expect(ValidationComposite).toHaveBeenCalledWith([])

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error
    })
  })

  it('should return same result of perform', async () => {
    const httpResponse = await sut.handle('any_data')

    expect(httpResponse).toEqual(sut.result)
  })

  it('should return 500 if perform throws', async () => {
    jest.spyOn(sut, 'perform').mockRejectedValueOnce(new Error('perform_error'))

    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(new Error('perform_error'))
    })
  })
})
