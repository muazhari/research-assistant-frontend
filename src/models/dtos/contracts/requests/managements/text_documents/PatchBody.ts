import DocumentPatchBody from '../documents/PatchBody.ts'

export default class PatchBody extends DocumentPatchBody {
  textContent?: string
  textContentHash?: string

  constructor (name?: string, description?: string, documentTypeId?: string, accountId?: string, textContent?: string, textContentHash?: string) {
    super(name, description, documentTypeId, accountId)
    this.textContent = textContent
    this.textContentHash = textContentHash
  }
}
