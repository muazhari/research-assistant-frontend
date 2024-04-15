import type PatchBody from './PatchBody.ts'
import Request from '../../Request.ts'

export default class PatchOneByIdRequest extends Request {
  id?: string
  body?: PatchBody

  constructor (id?: string, body?: PatchBody) {
    super()
    this.id = id
    this.body = body
  }
}
