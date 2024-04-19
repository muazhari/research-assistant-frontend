import Request from '../../Request.ts'

import Dto from '../../../../Dto.ts'

export class Body extends Dto {
  id?: string | null
  name?: string | null
  description?: string | null
  documentTypeId?: string | null
  accountId?: string | null

  constructor (id?: string | null, name?: string | null, description?: string | null, documentTypeId?: string | null, accountId?: string | null) {
    super()
    this.id = id
    this.name = name
    this.description = description
    this.documentTypeId = documentTypeId
    this.accountId = accountId
  }
}

export default class Search extends Request {
  body?: Body
  size?: number

  constructor (body?: Body, size?: number) {
    super()
    this.body = body
    this.size = size
  }
}
