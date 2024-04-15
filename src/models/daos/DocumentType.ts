import Dao from './Dao.ts'

export default class DocumentType extends Dao {
  id?: string
  description?: string

  constructor (id?: string, description?: string) {
    super()
    this.id = id
    this.description = description
  }
}
