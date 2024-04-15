import DocumentCreateBody from '../documents/CreateBody.ts'

export default class CreateBody extends DocumentCreateBody {
  textContent?: string
  textContentHash?: string

  constructor (name?: string, description?: string, documentTypeId?: string, accountId?: string, textContent?: string, textContentHash?: string) {
    super(name, description, documentTypeId, accountId)
    this.textContent = textContent
    this.textContentHash = textContentHash
  }
}
