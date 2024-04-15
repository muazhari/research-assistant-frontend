import Request from '../Request.ts'
import type InputSetting from './InputSetting.ts'
import type OutputSetting from '../basic_settings/OutputSeting.ts'

export default class SearchRequest extends Request {
  accountId?: string
  inputSetting?: InputSetting
  outputSetting?: OutputSetting

  constructor (accountId?: string, inputSetting?: InputSetting, outputSetting?: OutputSetting) {
    super()
    this.accountId = accountId
    this.inputSetting = inputSetting
    this.outputSetting = outputSetting
  }
}
