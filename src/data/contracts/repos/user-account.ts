export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => LoadUserAccountRepository.Result
}
export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }
  export type Result = Promise<void>
}

export interface CreateFacebookAccountRepository {
  createFromFacebook: (params: CreateFacebookAccountRepository.Params) => CreateFacebookAccountRepository.Result
}
export namespace CreateFacebookAccountRepository {
  export type Params = {
    email: string
    name: string
    facebookId: string
  }
  export type Result = Promise<void>
}
