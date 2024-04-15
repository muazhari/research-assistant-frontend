import Request from '../../Request.ts'
import type CreateBody from './CreateBody.ts'

export default class CreateOneRequest extends Request {
  body?: CreateBody

  constructor (body?: CreateBody) {
    super()
    this.body = body
  }
}
