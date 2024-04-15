import Request from '../Request.ts'

export default class OutputSetting extends Request {
  documentTypeId?: string

  constructor (documentTypeId?: string) {
    super()
    this.documentTypeId = documentTypeId
  }
}
