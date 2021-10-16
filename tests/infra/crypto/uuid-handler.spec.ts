import { UUIDGenerator } from '@/domain/contracts/gateways'
import { mocked } from 'ts-jest/utils'
import { v4 } from 'uuid'

class UUIDHandler {
  uuid ({ key }: UUIDGenerator.Params): UUIDGenerator.Output {
    return `${key}_${v4()}`
  }
}

jest.mock('uuid')
describe('UUIDHandler', () => {
  test('should call uuid.v4', () => {
    const sut = new UUIDHandler()

    sut.uuid({ key: 'any_key' })

    expect(v4).toHaveBeenCalledTimes(1)
  })
  test('should return a uuid', () => {
    mocked(v4).mockReturnValueOnce('any_uuid')
    const sut = new UUIDHandler()

    const result = sut.uuid({ key: 'any_key' })

    expect(result).toBe('any_key_any_uuid')
  })
})
