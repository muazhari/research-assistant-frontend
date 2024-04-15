import Request from '../Request.ts'
import type FileDocumentSetting from './FileDocumentSetting.ts'
import type TextDocumentSetting from './TextDocumentSetting.ts'
import type WebDocumentSetting from './WebDocumentSetting.ts'

export default class DocumentSetting extends Request {
  documentId?: string
  detailSetting?: FileDocumentSetting | TextDocumentSetting | WebDocumentSetting
  prefix?: string

  constructor (documentId?: string, detailSetting?: FileDocumentSetting | TextDocumentSetting | WebDocumentSetting, prefix?: string) {
    super()
    this.documentId = documentId
    this.detailSetting = detailSetting
    this.prefix = prefix
  }
}
