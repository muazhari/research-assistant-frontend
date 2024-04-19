import { type AxiosInstance } from 'axios'
import type Setting from '../settings/Setting.ts'

export default abstract class Client {
  abstract instance: AxiosInstance

  abstract clientSetting: Setting
}
