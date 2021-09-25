import { AxiosHttpClient } from '@/infra/http/axios-client'

export const makeAxiosHttpClient = (): AxiosHttpClient => {
  return new AxiosHttpClient()
}
