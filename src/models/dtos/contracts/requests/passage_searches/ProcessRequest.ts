import Request from '../Request.ts'
import type ProcessBody from './ProcessBody.ts'

export default class ProcessRequest extends Request {
  body?: ProcessBody

  constructor (body?: ProcessBody) {
    super()
    this.body = body
  }
}
