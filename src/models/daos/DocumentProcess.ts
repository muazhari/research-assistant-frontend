import Dao from './Dao.ts'

export default class DocumentProcess extends Dao {
  id?: string
  initialDocumentId?: string
  finalDocumentId?: string
  startedAt?: Date
  finishedAt?: Date

  constructor (id?: string, initialDocumentId?: string, finalDocumentId?: string, startedAt?: Date, finishedAt?: Date) {
    super()
    this.id = id
    this.initialDocumentId = initialDocumentId
    this.finalDocumentId = finalDocumentId
    this.startedAt = startedAt
    this.finishedAt = finishedAt
  }
}
