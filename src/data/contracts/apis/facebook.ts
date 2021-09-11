export interface LoadFacebookUserApi {
  loadUser: (params: LoadFacebookUserApi.Params) => LoadFacebookUserApi.Result
}
export namespace LoadFacebookUserApi {
  export type Params = { token: string }
  export type Result = Promise<undefined>
}
