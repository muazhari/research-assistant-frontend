import Response from '../Response.ts'
import type Account from '../../../../daos/Account.ts'
import type Session from '../../../../daos/Session.ts'

export default class LoginResponse extends Response {
  account?: Account
  session?: Session

  constructor (account?: Account, session?: Session) {
    super()
    this.account = account
    this.session = session
  }
}
