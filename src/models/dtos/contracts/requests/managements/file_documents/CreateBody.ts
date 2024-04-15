import DocumentCreateBody from '../documents/CreateBody.ts'

export default class CreateBody extends DocumentCreateBody {
  fileName?: string
  fileDataHash?: string

  constructor (name?: string, description?: string, documentTypeId?: string, accountId?: string, fileName?: string, fileDataHash?: string) {
    super(name, description, documentTypeId, accountId)
    this.fileName = fileName
    this.fileDataHash = fileDataHash
  }
}
