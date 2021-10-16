import { UserProfile } from '@/domain/entities/user-profile'

describe('UserProfile', () => {
  let sut: UserProfile
  beforeEach(() => {
    sut = new UserProfile('any_id')
  })
  it('should create a UserProfile with empty initials when pictureUrl is provided', () => {
    sut.setPicture({
      pictureUrl: 'any_picture_url',
      name: 'any_name'
    })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_picture_url',
      initials: undefined
    })
  })
  it('should create a UserProfile with empty initials when pictureUrl is provided', () => {
    sut.setPicture({
      pictureUrl: 'any_picture_url',
      name: undefined
    })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_picture_url',
      initials: undefined
    })
  })
  it('should create a UserProfile with initials when pictureUrl is provided', () => {
    sut.setPicture({
      pictureUrl: undefined,
      name: 'michael da silva quesado'
    })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'MQ'
    })
  })
  it('should create a UserProfile with initials when pictureUrl is provided', () => {
    sut.setPicture({
      pictureUrl: undefined,
      name: 'michael'
    })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'MI'
    })
  })
  it('should create a UserProfile with initials when pictureUrl is provided', () => {
    sut.setPicture({
      pictureUrl: undefined,
      name: 'm'
    })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'M'
    })
  })
  it('should create a UserProfile with initials when pictureUrl is provided', () => {
    sut.setPicture({
      pictureUrl: undefined,
      name: ''
    })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: undefined
    })
  })
})
