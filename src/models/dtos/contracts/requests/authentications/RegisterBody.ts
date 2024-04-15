import Request from '../Request.ts'

export default class RegisterBody extends Request {
  email?: string
  password?: string

  constructor (email?: string, password?: string) {
    super()
    this.email = email
    this.password = password
  }
}
