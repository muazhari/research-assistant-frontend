import Request from '../../Request.ts'
import Dto from '../../../../Dto.ts'

export class Body extends Dto {
  name?: string
  description?: string
  documentTypeId?: string
  accountId?: string

  constructor (name?: string, description?: string, documentTypeId?: string, accountId?: string) {
    super()
    this.name = name
    this.description = description
    this.documentTypeId = documentTypeId
    this.accountId = accountId
  }
}

export default class PatchOneById extends Request {
  id?: string
  body?: Body

  constructor (id?: string, body?: Body) {
    super()
    this.id = id
    this.body = body
  }
}
