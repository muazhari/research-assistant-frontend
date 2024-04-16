import Request from '../../Request.ts'
import { Body as DocumentBody } from '../documents/CreateOne.ts'

export class Body extends DocumentBody {
  textContent?: string
  textContentHash?: string

  constructor (name?: string, description?: string, documentTypeId?: string, accountId?: string, textContent?: string, textContentHash?: string) {
    super(name, description, documentTypeId, accountId)
    this.textContent = textContent
    this.textContentHash = textContentHash
  }
}

export default class CreateOne extends Request {
  body?: Body

  constructor (body?: Body) {
    super()
    this.body = body
  }
}
