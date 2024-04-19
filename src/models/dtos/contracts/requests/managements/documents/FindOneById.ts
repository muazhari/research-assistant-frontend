import Request from '../../Request.ts'

export default class FindOneById extends Request {
  id?: string

  constructor (id?: string) {
    super()
    this.id = id
  }
}
