import Request from '../Request.ts'
import PassageSearchInputSetting, {
  type EmbedderSetting,
  type LlmSetting,
  type PreprocessSetting,
  type RerankerSetting,
  type RetrieverSetting
} from '../passage_searches/InputSetting.ts'

export class GeneratorSetting extends Request {
  isForceRefreshGeneratedAnswer?: boolean
  isForceRefreshGeneratedQuestion?: boolean
  isForceRefreshGeneratedHallucinationGrade?: boolean
  isForceRefreshGeneratedRelevancyGrade?: boolean
  prompt?: string

  constructor (
    isForceRefreshGeneratedAnswer?: boolean,
    isForceRefreshGeneratedQuestion?: boolean,
    isForceRefreshGeneratedHallucinationGrade?: boolean,
    isForceRefreshGeneratedRelevancyGrade?: boolean,
    prompt?: string
  ) {
    super()
    this.isForceRefreshGeneratedAnswer = isForceRefreshGeneratedAnswer
    this.isForceRefreshGeneratedQuestion = isForceRefreshGeneratedQuestion
    this.isForceRefreshGeneratedHallucinationGrade = isForceRefreshGeneratedHallucinationGrade
    this.isForceRefreshGeneratedRelevancyGrade = isForceRefreshGeneratedRelevancyGrade
    this.prompt = prompt
  }
}

export default class InputSetting extends PassageSearchInputSetting {
  generatorSetting?: GeneratorSetting
  transformQuestionMaxRetry?: number

  constructor (
    llmSetting?: LlmSetting,
    preprocessSetting?: PreprocessSetting,
    embedderSetting?: EmbedderSetting,
    retrieverSetting?: RetrieverSetting,
    rerankerSetting?: RerankerSetting,
    question?: string,
    generatorSetting?: GeneratorSetting,
    transformQuestionMaxRetry?: number
  ) {
    super(llmSetting, preprocessSetting, embedderSetting, retrieverSetting, rerankerSetting, question)
    this.generatorSetting = generatorSetting
    this.transformQuestionMaxRetry = transformQuestionMaxRetry
  }
}
