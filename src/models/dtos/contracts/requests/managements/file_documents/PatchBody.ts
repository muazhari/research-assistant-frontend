import DocumentPatchBody from '../documents/PatchBody.ts'

export default class PatchBody extends DocumentPatchBody {
  fileName?: string
  fileDataHash?: string

  constructor (name?: string, description?: string, documentTypeId?: string, accountId?: string, fileName?: string, fileDataHash?: string) {
    super(name, description, documentTypeId, accountId)
    this.fileName = fileName
    this.fileDataHash = fileDataHash
  }
}
