import Dto from '../../../../Dto.ts'

export default class PatchBody extends Dto {
  email?: string
  password?: string

  constructor (email?: string, password?: string) {
    super()
    this.email = email
    this.password = password
  }
}
