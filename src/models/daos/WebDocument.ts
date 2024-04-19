import Document from './Document.ts'

export default class WebDocument extends Document {
  webUrl?: string
  webUrlHash?: string

  constructor (id?: string, name?: string, description?: string, documentTypeId?: string, accountId?: string, webUrl?: string, webUrlHash?: string) {
    super(id, name, description, documentTypeId, accountId)
    this.webUrl = webUrl
    this.webUrlHash = webUrlHash
  }
}
