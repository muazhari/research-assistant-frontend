import EmbeddingModel from './EmbeddingModel.ts'

export default class MultihopEmbeddingModel extends EmbeddingModel {
  model?: string
  apiKey?: string

  constructor (dimension?: number, model?: string, apiKey?: string) {
    super(dimension)
    this.model = model
    this.apiKey = apiKey
  }
}
