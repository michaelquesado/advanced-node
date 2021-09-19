class FacebookLoginController {
  async handle (params: { token: string }): Promise<HttpResponse> {
    return {
      statusCode: 400,
      body: new Error('Token must be provided')
    }
  }
}

type HttpResponse = {
  statusCode: number
  body: any
}

describe('FacebookLoginController', () => {
  it('should return 400 if token is empty', async () => {
    const sut = new FacebookLoginController()

    const httpResponse = await sut.handle({ token: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new Error('Token must be provided')
    })
  })
})
