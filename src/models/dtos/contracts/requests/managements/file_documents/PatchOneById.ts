import Request from '../../Request.ts'

import { Body as DocumentBody } from '../documents/PatchOneById.ts'

export class Body extends DocumentBody {
  fileName?: string
  fileData?: File
  fileDataHash?: string

  constructor (name?: string, description?: string, documentTypeId?: string, accountId?: string, fileName?: string, fileData?: File, fileDataHash?: string) {
    super(name, description, documentTypeId, accountId)
    this.fileName = fileName
    this.fileData = fileData
    this.fileDataHash = fileDataHash
  }
}

export default class PatchOneByIdRequest extends Request {
  id?: string
  body?: Body

  constructor (id?: string, body?: Body) {
    super()
    this.id = id
    this.body = body
  }
}
