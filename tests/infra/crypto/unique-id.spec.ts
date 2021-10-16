import { UniqueId } from '@/infra/crypto'

describe('UniqueId', () => {
  test('should generate a unique id', () => {
    const sut = new UniqueId(new Date(2020, 9, 16, 15, 15, 45))

    const result = sut.uuid({ key: 'any_key' })

    expect(result).toBe('any_key_20201016151545')
  })
  test('should generate a unique id', () => {
    const sut = new UniqueId(new Date(2020, 3, 2, 6, 15, 10))

    const result = sut.uuid({ key: 'any_key' })

    expect(result).toBe('any_key_20200402061510')
  })
})
