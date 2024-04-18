import Request from '../Request.ts'
import type InputSetting from './InputSetting.ts'

export class Body extends Request {
  inputSetting?: InputSetting

  constructor (inputSetting?: InputSetting) {
    super()
    this.inputSetting = inputSetting
  }
}

export default class ProcessRequest extends Request {
  body?: Body

  constructor (body?: Body) {
    super()
    this.body = body
  }
}
