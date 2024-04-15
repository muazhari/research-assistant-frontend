import Dto from '../Dto.ts'

export default class Content<T> extends Dto {
  message?: string
  data?: T

  constructor (message?: string, data?: T) {
    super()
    this.message = message
    this.data = data
  }
}
