import Request from '../Request.ts'
import type InputSetting from './InputSetting.ts'

export default class ProcessBody extends Request {
  inputSetting?: InputSetting

  constructor (inputSetting?: InputSetting) {
    super()
    this.inputSetting = inputSetting
  }
}
