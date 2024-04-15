import DocumentCreateBody from '../documents/CreateBody.ts'

export default class CreateBody extends DocumentCreateBody {
  webUrl?: string
  webUrlHash?: string

  constructor (name?: string, description?: string, documentTypeId?: string, accountId?: string, webUrl?: string, webUrlHash?: string) {
    super(name, description, documentTypeId, accountId)
    this.webUrl = webUrl
    this.webUrlHash = webUrlHash
  }
}
