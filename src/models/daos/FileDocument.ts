import Document from './Document.ts'

export default class FileDocument extends Document {
  fileName?: string
  fileDataHash?: string

  constructor (id?: string, name?: string, description?: string, documentTypeId?: string, accountId?: string, fileName?: string, fileDataHash?: string) {
    super(id, name, description, documentTypeId, accountId)
    this.fileName = fileName
    this.fileDataHash = fileDataHash
  }
}
