import Request from '../../Request.ts'

export default class FindManyWithPagination extends Request {
  pagePosition?: number
  pageSize?: number

  constructor (pagePosition?: number, pageSize?: number) {
    super()
    this.pagePosition = pagePosition
    this.pageSize = pageSize
  }
}
