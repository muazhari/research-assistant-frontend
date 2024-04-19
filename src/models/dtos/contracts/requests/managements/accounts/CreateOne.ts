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

export default class CreateOne extends Request {
  body?: Body

  constructor (body?: Body) {
    super()
    this.body = body
  }
}
