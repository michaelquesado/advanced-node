import { HttpGetClient } from '@/infra/gateways'

import axios from 'axios'

export class AxiosHttpClient implements HttpGetClient {
  async get<T = any> ({ params, url }: HttpGetClient.Params): Promise<T> {
    const result = await axios.get(url, { params })
    return result.data
  }
}
