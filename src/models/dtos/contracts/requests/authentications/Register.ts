import Request from '../Request.ts'

export class Body extends Request {
  email?: string
  password?: string

  constructor (email?: string, password?: string) {
    super()
    this.email = email
    this.password = password
  }
}
export default class Register extends Request {
  body?: Body
}
