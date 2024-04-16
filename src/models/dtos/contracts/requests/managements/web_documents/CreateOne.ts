import Request from '../../Request.ts'
import { Body as DocumentBody } from '../documents/CreateOne.ts'

export class Body extends DocumentBody {
  webUrl?: string
  webUrlHash?: string

  constructor (name?: string, description?: string, documentTypeId?: string, accountId?: string, webUrl?: string, webUrlHash?: string) {
    super(name, description, documentTypeId, accountId)
    this.webUrl = webUrl
    this.webUrlHash = webUrlHash
  }
}

export default class CreateOne extends Request {
  body?: Body

  constructor (body?: Body) {
    super()
    this.body = body
  }
}
