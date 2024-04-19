import Setting from './Setting.ts'

export default class ClientSetting extends Setting {
  URL: string | undefined

  constructor (URL: string | undefined) {
    super()
    this.URL = URL
  }
}
