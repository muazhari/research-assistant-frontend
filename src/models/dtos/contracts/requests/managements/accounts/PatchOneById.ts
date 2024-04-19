import Request from '../../Request.ts'
import Dto from '../../../../Dto.ts'

export class Body extends Dto {
  email?: string
  password?: string

  constructor (email?: string, password?: string) {
    super()
    this.email = email
    this.password = password
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
