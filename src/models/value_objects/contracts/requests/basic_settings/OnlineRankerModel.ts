import BaseRankerModel from './BaseRankerModel.ts'

export default class OnlineRankerModel extends BaseRankerModel {
  apiKey?: string

  constructor (model?: string, apiKey?: string) {
    super(model)
    this.apiKey = apiKey
  }
}
