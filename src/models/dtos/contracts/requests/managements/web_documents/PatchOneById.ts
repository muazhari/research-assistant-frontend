import Request from '../../Request.ts'
import { Body as DocumentBody } from '../documents/PatchOneById.ts'

export class Body extends DocumentBody {
  webUrl?: string
  webUrlHash?: string

  constructor (name?: string, description?: string, documentTypeId?: string, accountId?: string, webUrl?: string, webUrlHash?: string) {
    super(name, description, documentTypeId, accountId)
    this.webUrl = webUrl
    this.webUrlHash = webUrlHash
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
