import { UUIDGenerator } from '@/domain/contracts/gateways'
import { v4 } from 'uuid'

class UUIDHandler {
  uuid ({ key }: UUIDGenerator.Params): void {
    v4()
  }
}

jest.mock('uuid')
describe('UUIDHandler', () => {
  test('should call uuid.v4', () => {
    const sut = new UUIDHandler()

    sut.uuid({ key: 'any_key' })

    expect(v4).toHaveBeenCalledTimes(1)
  })
})
