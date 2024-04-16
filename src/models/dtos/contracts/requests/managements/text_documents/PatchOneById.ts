import Request from '../../Request.ts'

import { Body as DocumentBody } from '../documents/PatchOneById.ts'

export class Body extends DocumentBody {
  textContent?: string
  textContentHash?: string

  constructor (name?: string, description?: string, documentTypeId?: string, accountId?: string, textContent?: string, textContentHash?: string) {
    super(name, description, documentTypeId, accountId)
    this.textContent = textContent
    this.textContentHash = textContentHash
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
