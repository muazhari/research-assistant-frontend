import Response from '../Response.ts'
import { type ReRankedDocument } from '../passage_searchs/ProcessResponse.ts'

export default class ProcessResponse extends Response {
  reRankedDocuments?: ReRankedDocument[]
  generatedAnswer?: string
  startedAt?: Date
  finishedAt?: Date

  constructor (
    reRankedDocuments?: ReRankedDocument[],
    generatedAnswer?: string,
    startedAt?: Date,
    finishedAt?: Date
  ) {
    super()
    this.reRankedDocuments = reRankedDocuments
    this.generatedAnswer = generatedAnswer
    this.startedAt = startedAt
    this.finishedAt = finishedAt
  }
}
