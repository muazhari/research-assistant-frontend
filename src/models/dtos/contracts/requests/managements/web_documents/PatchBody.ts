import DocumentPatchBody from '../documents/PatchBody.ts'

export default class PatchBody extends DocumentPatchBody {
  webUrl?: string
  webUrlHash?: string

  constructor (name?: string, description?: string, documentTypeId?: string, accountId?: string, webUrl?: string, webUrlHash?: string) {
    super(name, description, documentTypeId, accountId)
    this.webUrl = webUrl
    this.webUrlHash = webUrlHash
  }
}
