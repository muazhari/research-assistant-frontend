import Request from '../Request.ts'

export default class EmbeddingModel extends Request {
  dimension?: number

  constructor (dimension?: number) {
    super()
    this.dimension = dimension
  }
}
