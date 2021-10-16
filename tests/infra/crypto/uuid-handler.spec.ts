import { UUIDGenerator } from '@/domain/contracts/gateways'
import { mocked } from 'ts-jest/utils'
import { v4 } from 'uuid'

class UUIDHandler implements UUIDGenerator {
  uuid ({ key }: UUIDGenerator.Params): UUIDGenerator.Output {
    return `${key}_${v4()}`
  }
}

jest.mock('uuid')
describe('UUIDHandler', () => {
  let sut: UUIDHandler
  beforeEach(() => {
    sut = new UUIDHandler()
  })
  beforeAll(() => {
    mocked(v4).mockReturnValue('any_uuid')
  })
  test('should call uuid.v4', () => {
    sut.uuid({ key: 'any_key' })

    expect(v4).toHaveBeenCalledTimes(1)
  })
  test('should return a uuid', () => {
    const result = sut.uuid({ key: 'any_key' })

    expect(result).toBe('any_key_any_uuid')
  })
})
