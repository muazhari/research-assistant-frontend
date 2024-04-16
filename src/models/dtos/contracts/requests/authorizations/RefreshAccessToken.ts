import Request from '../Request.ts'

export class Body extends Request {
  refreshToken?: string

  constructor (refreshToken?: string) {
    super()
    this.refreshToken = refreshToken
  }
}

export default class RefreshAccessToken extends Request {
  body?: Body

  constructor (body?: Body) {
    super()
    this.body = body
  }
}
