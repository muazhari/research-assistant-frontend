import Request from '../../Request.ts'
import Dto from '../../../../Dto.ts'

export class Body extends Dto {
  description?: string

  constructor (description?: string) {
    super()
    this.description = description
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
