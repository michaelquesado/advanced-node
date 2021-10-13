import { UserProfile } from '@/domain/entities/user-profile'

describe('UserProfile', () => {
  it('should create a UserProfile with empty initials when pictureUrl is provided', () => {
    const sut = new UserProfile('any_id')
    sut.setPicture({
      pictureUrl: 'any_picture_url',
      name: 'any_name'
    })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_picture_url',
      name: undefined
    })
  })
})
