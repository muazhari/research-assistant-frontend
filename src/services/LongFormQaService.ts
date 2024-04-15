import Service from './Service.ts'
import type Client from '../clients/Client.ts'
import BackendOneClient from '../clients/BackendOneClient.ts'
import { type AxiosResponse } from 'axios'
import type Content from '../models/dtos/contracts/Content.ts'
import type ProcessRequest from '../models/dtos/contracts/requests/long_form_qas/ProcessRequest.ts'
import type ProcessResponse from '../models/dtos/contracts/response/long_form_qas/ProcessResponse.ts'

export default class LongFormQaService extends Service {
  client: Client

  path: string

  constructor () {
    super()
    this.client = new BackendOneClient()
    this.path = '/long-form-qa'
  }

  async qa (request: ProcessRequest): Promise<AxiosResponse<Content<ProcessResponse>>> {
    return await this.client.instance.post(`${this.path}`, request)
  }
}
