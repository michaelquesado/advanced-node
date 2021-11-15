import { UniqueId } from '@/infra/gateways'

import { set, reset } from 'mockdate'

describe('UniqueId', () => {
  let sut: UniqueId
  beforeAll(() => {
    sut = new UniqueId()
    set(new Date(2020, 9, 16, 15, 15, 45))
  })
  afterAll(() => reset())
  test('should generate a unique id', () => {
    const result = sut.uuid({ key: 'any_key' })

    expect(result).toBe('any_key_20201016151545')
  })
})
