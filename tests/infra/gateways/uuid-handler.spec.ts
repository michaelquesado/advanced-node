import { UUIDHandler } from '@/infra/gateways'
import { v4 } from 'uuid'
import { mocked } from 'ts-jest/utils'

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
