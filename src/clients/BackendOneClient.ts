import ClientSetting from '../settings/ClientSetting.ts'
import Client from './Client.ts'
import axios, { type AxiosInstance } from 'axios'
import applyCaseMiddleware from 'axios-case-converter'

export default class BackendOneClient extends Client {
  instance: AxiosInstance

  clientSetting: ClientSetting

  constructor () {
    super()
    this.clientSetting = new ClientSetting(
      process.env.FARM_API_URL_BACKEND_ONE
    )
    this.instance = axios.create({
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      baseURL: this.clientSetting.URL
    })
    this.instance = applyCaseMiddleware(this.instance)
  }
}
