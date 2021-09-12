import { HttpGetClient } from '@/infra/http'

import axios from 'axios'

jest.mock('axios')

class AxiosClient {
  async get (args: HttpGetClient.Params): Promise<any> {
    const result = await axios.get(args.url, { params: args.params })
    return result.data
  }
}
describe('AxiosHttpClient', () => {
  let sut: AxiosClient
  let fakeAxios: jest.Mocked<typeof axios>
  let url: string
  let params: object

  beforeAll(() => {
    url = 'any_url'
    params = { any: 'any' }
    fakeAxios = axios as jest.Mocked<typeof axios>
    fakeAxios.get.mockResolvedValue({
      status: 200,
      data: 'any_result'
    })
  })

  beforeEach(() => {
    sut = new AxiosClient()
  })

  describe('get', () => {
    it('should call get with correct params ', async () => {
      await sut.get({ url, params })

      expect(fakeAxios.get).toHaveBeenCalledWith(url, { params })
      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    })
    it('should return data on success ', async () => {
      const result = await sut.get({ url, params })

      expect(result).toBe('any_result')
    })
    it('should rethrow if get throws ', async () => {
      fakeAxios.get.mockRejectedValue(new Error('http_error'))
      const promise = sut.get({ url, params })

      await expect(promise).rejects.toThrow(new Error('http_error'))
    })
  })
})
