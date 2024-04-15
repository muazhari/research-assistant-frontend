import Request from '../Request.ts'
import type SentenceTransformersRankerModel from './SentenceTransformersRankerModel.ts'
import type OnlineRankerModel from './OnlineRankerModel.ts'

export default class Ranker extends Request {
  sourceType?: string
  rankerModel?: SentenceTransformersRankerModel | OnlineRankerModel
  topK?: number

  constructor (sourceType?: string, rankerModel?: SentenceTransformersRankerModel | OnlineRankerModel, topK?: number) {
    super()
    this.sourceType = sourceType
    this.rankerModel = rankerModel
    this.topK = topK
  }
}
