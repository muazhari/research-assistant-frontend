import DocumentCreateBody from '../documents/CreateBody.ts'

export default class CreateBody extends DocumentCreateBody {
  webUrl?: string

  constructor (name?: string, description?: string, documentTypeId?: string, accountId?: string, webUrl?: string) {
    super(name, description, documentTypeId, accountId)
    this.webUrl = webUrl
  }
}
