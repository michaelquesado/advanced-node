export interface TokenGenerator {
  generateToken: (params: TokenGenerator.Params) => TokenGenerator.Result
}

export namespace TokenGenerator {
  export type Params = {
    key: string
  }
  export type Result = Promise<void>
}
