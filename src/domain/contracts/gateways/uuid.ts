export interface UUIDGenerator {
  uuid: (input: UUIDGenerator.Params) => UUIDGenerator.Output
}

export namespace UUIDGenerator {
  export type Params = {
    key: string
  }
  export type Output = string
}
