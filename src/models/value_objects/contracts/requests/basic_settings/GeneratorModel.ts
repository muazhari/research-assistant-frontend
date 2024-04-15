import Request from '../Request.ts'

export default class GeneratorModel extends Request {
  model?: string

  constructor (model?: string) {
    super()
    this.model = model
  }
}
