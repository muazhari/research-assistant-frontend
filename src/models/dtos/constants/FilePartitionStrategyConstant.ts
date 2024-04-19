import Dto from '../Dto.ts'

export default class FilePartitionStrategyConstant extends Dto {
  static AUTO: string = 'auto'
  static FAST: string = 'fast'
  static OCR_ONLY: string = 'ocr_only'
  static HI_RES: string = 'hi_res'

  static getValues (): string[] {
    return [
      FilePartitionStrategyConstant.AUTO,
      FilePartitionStrategyConstant.FAST,
      FilePartitionStrategyConstant.OCR_ONLY,
      FilePartitionStrategyConstant.HI_RES
    ]
  }
}
