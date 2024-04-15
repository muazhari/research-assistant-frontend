import Request from '../Request.ts'

export class LlmSetting extends Request {
  modelName?: string
  maxToken?: number

  constructor (modelName?: string, maxToken?: number) {
    super()
    this.modelName = modelName
    this.maxToken = maxToken
  }
}

export class PreprocessSetting extends Request {
  isForceRefreshCategorizedElement?: boolean
  isForceRefreshCategorizedDocument?: boolean
  chunkSize?: number
  overlapSize?: number
  isIncludeImage?: boolean
  isIncludeTable?: boolean

  constructor (isForceRefreshCategorizedElement?: boolean, isForceRefreshCategorizedDocument?: boolean, chunkSize?: number, overlapSize?: number, isIncludeImage?: boolean, isIncludeTable?: boolean) {
    super()
    this.isForceRefreshCategorizedElement = isForceRefreshCategorizedElement
    this.isForceRefreshCategorizedDocument = isForceRefreshCategorizedDocument
    this.chunkSize = chunkSize
    this.overlapSize = overlapSize
    this.isIncludeImage = isIncludeImage
    this.isIncludeTable = isIncludeTable
  }
}

export class EmbedderSetting extends Request {
  isForceRefreshEmbedding?: boolean
  isForceRefreshDocument?: boolean
  modelName?: string
  queryInstruction?: string

  constructor (isForceRefreshEmbedding?: boolean, isForceRefreshDocument?: boolean, modelName?: string, queryInstruction?: string) {
    super()
    this.isForceRefreshEmbedding = isForceRefreshEmbedding
    this.isForceRefreshDocument = isForceRefreshDocument
    this.modelName = modelName
    this.queryInstruction = queryInstruction
  }
}

export class RetrieverSetting extends Request {
  isForceRefreshRelevantDocument?: boolean
  topK?: number

  constructor (isForceRefreshRelevantDocument?: boolean, topK?: number) {
    super()
    this.isForceRefreshRelevantDocument = isForceRefreshRelevantDocument
    this.topK = topK
  }
}

export class RerankerSetting extends Request {
  isForceRefreshReRankedDocument?: boolean
  modelName?: string
  topK?: number

  constructor (isForceRefreshReRankedDocument?: boolean, modelName?: string, topK?: number) {
    super()
    this.isForceRefreshReRankedDocument = isForceRefreshReRankedDocument
    this.modelName = modelName
    this.topK = topK
  }
}

export default class InputSetting extends Request {
  llmSetting?: LlmSetting
  preprocessSetting?: PreprocessSetting
  embedderSetting?: EmbedderSetting
  retrieverSetting?: RetrieverSetting
  rerankerSetting?: RerankerSetting
  question?: string

  constructor (llmSetting?: LlmSetting, preprocessSetting?: PreprocessSetting, embedderSetting?: EmbedderSetting, retrieverSetting?: RetrieverSetting, rerankerSetting?: RerankerSetting, question?: string) {
    super()
    this.llmSetting = llmSetting
    this.preprocessSetting = preprocessSetting
    this.embedderSetting = embedderSetting
    this.retrieverSetting = retrieverSetting
    this.rerankerSetting = rerankerSetting
    this.question = question
  }
}
