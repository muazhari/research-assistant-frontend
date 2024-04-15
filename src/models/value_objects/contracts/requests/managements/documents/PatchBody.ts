import ValueObject from '../../../../ValueObject.ts'

export default class PatchBody extends ValueObject {
  name?: string
  description?: string
  documentTypeId?: string
  accountId?: string

  constructor (name?: string, description?: string, documentTypeId?: string, accountId?: string) {
    super()
    this.name = name
    this.description = description
    this.documentTypeId = documentTypeId
    this.accountId = accountId
  }
}
