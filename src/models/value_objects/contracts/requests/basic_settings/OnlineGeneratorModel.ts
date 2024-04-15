import GeneratorModel from './GeneratorModel.ts'

export default class OnlineGeneratorModel extends GeneratorModel {
  apiKey?: string

  constructor (model?: string, apiKey?: string) {
    super(model)
    this.apiKey = apiKey
  }
}
