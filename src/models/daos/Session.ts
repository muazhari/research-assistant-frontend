import Dao from './Dao.ts'

export default class Session extends Dao {
  id?: string
  accountId?: string
  accessToken?: string
  refreshToken?: string
  accessTokenExpiredAt?: Date
  refreshTokenExpiredAt?: Date

  constructor (id?: string, accountId?: string, accessToken?: string, refreshToken?: string, accessTokenExpiredAt?: Date, refreshTokenExpiredAt?: Date) {
    super()
    this.id = id
    this.accountId = accountId
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    this.accessTokenExpiredAt = accessTokenExpiredAt
    this.refreshTokenExpiredAt = refreshTokenExpiredAt
  }
}
