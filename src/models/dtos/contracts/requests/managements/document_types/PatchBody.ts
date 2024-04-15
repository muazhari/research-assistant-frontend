import Dto from '../../../../Dto.ts'

export default class PatchBody extends Dto {
  description?: string

  constructor (description?: string) {
    super()
    this.description = description
  }
}
