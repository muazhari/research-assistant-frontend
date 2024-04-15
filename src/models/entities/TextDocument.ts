import Document from './Document.ts'

export default class TextDocument extends Document {
  textContent?: string

  constructor (id?: string, name?: string, description?: string, documentTypeId?: string, accountId?: string, textContent?: string) {
    super(id, name, description, documentTypeId, accountId)
    this.textContent = textContent
  }
}
