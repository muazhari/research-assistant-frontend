import Document from './Document.ts'

export default class FileDocument extends Document {
  fileName?: string
  fileExtension?: string
  fileBytes?: string

  constructor (id?: string, name?: string, description?: string, documentTypeId?: string, accountId?: string, fileName?: string, fileExtension?: string, fileBytes?: string) {
    super(id, name, description, documentTypeId, accountId)
    this.fileName = fileName
    this.fileExtension = fileExtension
    this.fileBytes = fileBytes
  }
}
