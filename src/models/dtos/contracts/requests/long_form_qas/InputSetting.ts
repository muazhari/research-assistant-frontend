import Request from '../Request.ts'
import PassageSearchInputSetting, {
  type EmbedderSetting,
  type LlmSetting,
  type PreprocessorSetting,
  type RerankerSetting,
  type RetrieverSetting
} from '../passage_searches/InputSetting.ts'

export class GeneratorSetting extends Request {
  isForceRefreshGeneratedAnswer?: boolean
  isForceRefreshGeneratedQuestion?: boolean
  isForceRefreshGeneratedHallucinationGrade?: boolean
  isForceRefreshGeneratedAnswerRelevancyGrade?: boolean
  prompt?: string

  constructor (
    isForceRefreshGeneratedAnswer?: boolean,
    isForceRefreshGeneratedQuestion?: boolean,
    isForceRefreshGeneratedHallucinationGrade?: boolean,
    isForceRefreshGeneratedAnswerRelevancyGrade?: boolean,
    prompt?: string
  ) {
    super()
    this.isForceRefreshGeneratedAnswer = isForceRefreshGeneratedAnswer
    this.isForceRefreshGeneratedQuestion = isForceRefreshGeneratedQuestion
    this.isForceRefreshGeneratedHallucinationGrade = isForceRefreshGeneratedHallucinationGrade
    this.isForceRefreshGeneratedAnswerRelevancyGrade = isForceRefreshGeneratedAnswerRelevancyGrade
    this.prompt = prompt
  }
}

export default class InputSetting extends PassageSearchInputSetting {
  generatorSetting?: GeneratorSetting
  transformQuestionMaxRetry?: number

  constructor (
    documentIds?: string[],
    llmSetting?: LlmSetting,
    preprocessorSetting?: PreprocessorSetting,
    embedderSetting?: EmbedderSetting,
    retrieverSetting?: RetrieverSetting,
    rerankerSetting?: RerankerSetting,
    question?: string,
    generatorSetting?: GeneratorSetting,
    transformQuestionMaxRetry?: number
  ) {
    super(documentIds, llmSetting, preprocessorSetting, embedderSetting, retrieverSetting, rerankerSetting, question)
    this.generatorSetting = generatorSetting
    this.transformQuestionMaxRetry = transformQuestionMaxRetry
  }
}
