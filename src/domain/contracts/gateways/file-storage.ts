
export interface UploadFile {
  upload: (input: UploadFile.Params) => Promise<void>
}

export namespace UploadFile {
  export type Params = {
    key: string
    file: Buffer
  }
}
