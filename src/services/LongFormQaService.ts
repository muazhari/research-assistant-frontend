import Service from './Service.ts'
import type Client from '../clients/Client.ts'
import BackendOneClient from '../clients/BackendOneClient.ts'
import { type AxiosResponse } from 'axios'
import type Content from '../models/value_objects/contracts/Content.ts'
import type QaRequest from '../models/value_objects/contracts/requests/long_form_qas/QaRequest.ts'
import type QaResponse from '../models/value_objects/contracts/response/long_form_qas/QaResponse.ts'

export default class LongFormQaService extends Service {
  client: Client

  path: string

  constructor () {
    super()
    this.client = new BackendOneClient()
    this.path = '/long-form-qa'
  }

  async qa (request: QaRequest): Promise<AxiosResponse<Content<QaResponse>>> {
    return await this.client.instance.post(`${this.path}`, request)
  }
}
