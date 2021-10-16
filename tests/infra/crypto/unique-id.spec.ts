import { UUIDGenerator } from '@/domain/contracts/gateways'

class UniqueId implements UUIDGenerator {
  constructor (private readonly date: Date) {}

  uuid ({ key }: UUIDGenerator.Params): UUIDGenerator.Output {
    return key +
    '_' +
    this.date.getFullYear().toString() +
    (this.date.getMonth() + 1).toString().padStart(2, '0') +
    this.date.getDate().toString().padStart(2, '0') +
    this.date.getHours().toString().padStart(2, '0') +
    this.date.getMinutes().toString().padStart(2, '0') +
    this.date.getSeconds().toString().padStart(2, '0')
  }
}

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
