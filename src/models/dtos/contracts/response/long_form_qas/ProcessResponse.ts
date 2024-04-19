import Response from '../Response.ts'
import { type ReRankedDocument } from '../passage_searches/ProcessResponse.ts'

export default class ProcessResponse extends Response {
  reRankedDocuments?: ReRankedDocument[]
  generatedAnswer?: string
  startedAt?: string
  finishedAt?: string

  constructor (
    reRankedDocuments?: ReRankedDocument[],
    generatedAnswer?: string,
    startedAt?: string,
    finishedAt?: string
  ) {
    super()
    this.reRankedDocuments = reRankedDocuments
    this.generatedAnswer = generatedAnswer
    this.startedAt = startedAt
    this.finishedAt = finishedAt
  }
}
