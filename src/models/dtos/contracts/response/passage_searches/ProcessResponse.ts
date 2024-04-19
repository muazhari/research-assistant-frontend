import Response from '../Response.ts'
import type DocumentProcess from '../../../../daos/DocumentProcess.ts'

export class DocumentMetadata extends Response {
  reRankedScore?: number
  relevancyScore?: number
  documentId?: string
  originMetadata?: any[]
}

export class ReRankedDocument extends Response {
  pageContent?: string
  metadata?: DocumentMetadata

  constructor (
    pageContent?: string,
    metadata?: DocumentMetadata
  ) {
    super()
    this.pageContent = pageContent
    this.metadata = metadata
  }
}

export default class ProcessResponse extends Response {
  reRankedDocuments?: ReRankedDocument[]
  documentProcesses?: DocumentProcess[]
  finalDocumentUrls?: string[]
  startedAt?: string
  finishedAt?: string

  constructor (
    reRankedDocuments?: ReRankedDocument[],
    documentProcesses?: DocumentProcess[],
    finalDocumentUrls?: string[],
    startedAt?: string,
    finishedAt?: string
  ) {
    super()
    this.reRankedDocuments = reRankedDocuments
    this.documentProcesses = documentProcesses
    this.finalDocumentUrls = finalDocumentUrls
    this.startedAt = startedAt
    this.finishedAt = finishedAt
  }
}
