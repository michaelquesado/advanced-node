export interface UserProfilePicture {
  save: (params: UserProfilePicture.Params) => Promise<void>
}
export namespace UserProfilePicture {
  export type Params = {
    pictureUrl: string
  }
}
