import Dao from './Dao.ts'

export default class Account extends Dao {
  id?: string
  email?: string
  password?: string

  constructor (id?: string, email?: string, password?: string) {
    super()
    this.id = id
    this.email = email
    this.password = password
  }
}
