import Response from '../Response.ts'
import { type ReRankedDocument } from '../passage_searches/ProcessResponse.ts'

export default class ProcessResponse extends Response {
  reRankedDocuments?: ReRankedDocument[]
  generatedAnswer?: string
  hallucinationGrade?: boolean
  answerRelevancyGrade?: boolean
  startedAt?: string
  finishedAt?: string

  constructor (
    reRankedDocuments?: ReRankedDocument[],
    generatedAnswer?: string,
    hallucinationGrade?: boolean,
    answerRelevancyGrade?: boolean,
    startedAt?: string,
    finishedAt?: string
  ) {
    super()
    this.reRankedDocuments = reRankedDocuments
    this.generatedAnswer = generatedAnswer
    this.hallucinationGrade = hallucinationGrade
    this.answerRelevancyGrade = answerRelevancyGrade
    this.startedAt = startedAt
    this.finishedAt = finishedAt
  }
}
