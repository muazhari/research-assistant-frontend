import type DocumentSetting from '../basic_settings/DocumentSetting.ts'
import type DenseRetriever from '../basic_settings/DenseRetriever.ts'
import type SparseRetriever from '../basic_settings/SparseRetriever.ts'
import type Generator from '../basic_settings/Generator.ts'
import Request from '../Request.ts'
import type Ranker from '../basic_settings/Ranker.ts'
import type QuerySetting from '../basic_settings/QuerySetting.ts'

export default class InputSetting extends Request {
  query?: string
  granularity?: string
  windowSizes?: number[]
  querySetting?: QuerySetting
  documentSetting?: DocumentSetting
  denseRetriever?: DenseRetriever
  sparseRetriever?: SparseRetriever
  ranker?: Ranker
  generator?: Generator

  constructor (
    query?: string,
    granularity?: string,
    windowSizes?: number[],
    querySetting?: QuerySetting,
    documentSetting?: DocumentSetting,
    denseRetriever?: DenseRetriever,
    sparseRetriever?: SparseRetriever,
    ranker?: Ranker,
    generator?: Generator
  ) {
    super()
    this.query = query
    this.granularity = granularity
    this.windowSizes = windowSizes
    this.querySetting = querySetting
    this.documentSetting = documentSetting
    this.denseRetriever = denseRetriever
    this.sparseRetriever = sparseRetriever
    this.ranker = ranker
    this.generator = generator
  }
}
