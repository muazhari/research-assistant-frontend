import Dto from '../Dto.ts'

export default class DocumentTypeConstant extends Dto {
  static FILE: string = 'file'
  static TEXT: string = 'text'
  static WEB: string = 'web'

  static getValues (): string[] {
    return [
      DocumentTypeConstant.FILE,
      DocumentTypeConstant.TEXT,
      DocumentTypeConstant.WEB
    ]
  }
}
