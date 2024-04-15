import Request from '../Request.ts'
import type HydeSetting from './HydeSetting.ts'

export default class QuerySetting extends Request {
  prefix?: string
  hydeSetting?: HydeSetting

  constructor (prefix?: string, hydeSetting?: HydeSetting) {
    super()
    this.prefix = prefix
    this.hydeSetting = hydeSetting
  }
}
