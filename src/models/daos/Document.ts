import Dao from './Dao.ts'

export default class Document extends Dao {
  id?: string
  name?: string
  description?: string
  documentTypeId?: string
  accountId?: string

  constructor (id?: string, name?: string, description?: string, documentTypeId?: string, accountId?: string) {
    super()
    this.id = id
    this.name = name
    this.description = description
    this.documentTypeId = documentTypeId
    this.accountId = accountId
  }
}
