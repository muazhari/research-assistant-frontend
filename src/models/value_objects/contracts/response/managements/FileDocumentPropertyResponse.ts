import Response from '../Response.ts'

export default class FileDocumentPropertyResponse extends Response {
  pageLength?: number

  constructor (pageLength?: number) {
    super()
    this.pageLength = pageLength
  }
}
