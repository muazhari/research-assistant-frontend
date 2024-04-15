import DocumentCreateBody from '../documents/CreateBody.ts'

export default class CreateBody extends DocumentCreateBody {
  textContent?: string

  constructor (name?: string, description?: string, documentTypeId?: string, accountId?: string, textContent?: string) {
    super(name, description, documentTypeId, accountId)
    this.textContent = textContent
  }
}
