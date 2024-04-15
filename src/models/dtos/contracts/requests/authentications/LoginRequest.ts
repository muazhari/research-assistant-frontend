import Request from '../Request.ts'
import type LoginBody from './LoginBody.ts'

export default class LoginRequest extends Request {
  body?: LoginBody
}
