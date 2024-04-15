import Retriever from './Retriever.ts'

export default class SparseRetriever extends Retriever {
  model?: string

  constructor (
    model?: string,
    sourceType?: string,
    topK?: number,
    similarityFunction?: string,
    isRefresh?: boolean
  ) {
    super(sourceType, topK, similarityFunction, isRefresh)
    this.model = model
  }
}
