import { FacebookAccount } from '@/domain/models/facebook-account'

describe('FacebookAccount', () => {
  it('should create a FbData', () => {
    const sut = new FacebookAccount({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    expect(sut).toEqual({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
  })
  it('should create a accountData', () => {
    const sut = new FacebookAccount({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    }, {
      id: 'any_id'
    })
    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
  })
  it('should not update name', () => {
    const sut = new FacebookAccount({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    }, {
      id: 'any_id'
    })
    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
  })
  it('should update name', () => {
    const sut = new FacebookAccount({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    }, {
      id: 'any_id',
      name: 'any_name'
    })
    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
  })
})
