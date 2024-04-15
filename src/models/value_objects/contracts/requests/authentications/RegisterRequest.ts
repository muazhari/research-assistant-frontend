import Request from '../Request.ts'
import type RegisterBody from './RegisterBody.ts'

export default class RegisterRequest extends Request {
  body?: RegisterBody
}
