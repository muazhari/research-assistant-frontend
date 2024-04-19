import Document from './Document.ts'
import Request from '../dtos/contracts/requests/Request.ts'

export class FileMetadata extends Request {
  fileUrl?: string

  constructor (fileUrl?: string) {
    super()
    this.fileUrl = fileUrl
  }
}

export default class FileDocument extends Document {
  fileName?: string
  fileDataHash?: string
  fileMetadata?: FileMetadata

  constructor (id?: string, name?: string, description?: string, documentTypeId?: string, accountId?: string, fileName?: string, fileDataHash?: string, fileMetadata?: FileMetadata) {
    super(id, name, description, documentTypeId, accountId)
    this.fileName = fileName
    this.fileDataHash = fileDataHash
    this.fileMetadata = fileMetadata
  }
}
