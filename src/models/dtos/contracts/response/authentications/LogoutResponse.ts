import Response from '../Response.ts'
import type Account from '../../../../daos/Account.ts'

export default class LogoutResponse extends Response {
  account?: Account

  constructor (account?: Account) {
    super()
    this.account = account
  }
}
