import Response from '../Response.ts'
import type Account from '../../../../entities/Account.ts'

export default class LoginResponse extends Response {
  account?: Account

  constructor (account?: Account) {
    super()
    this.account = account
  }
}
