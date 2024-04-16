import Request from '../../Request.ts'
import { Body as DocumentBody } from '../documents/CreateOne.ts'

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

export default class CreateOne extends Request {
  body?: Body

  constructor (body?: Body) {
    super()
    this.body = body
  }
}
