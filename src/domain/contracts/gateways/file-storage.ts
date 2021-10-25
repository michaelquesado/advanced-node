export interface UploadFile {
  upload: (input: UploadFile.Params) => Promise<UploadFile.Result>
}

export namespace UploadFile {
  export type Params = {
    fileName: string
    file: Buffer
  }
  export type Result = string
}
export interface DeleteFile {
  delete: (input: DeleteFile.Params) => Promise<void>
}

export namespace DeleteFile {
  export type Params = {
    fileName: string
  }
}
