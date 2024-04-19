import Service from './Service.ts'
import type Client from '../clients/Client.ts'
import { type AxiosResponse } from 'axios'
import type Content from '../models/dtos/contracts/Content.ts'
import type ProcessRequest from '../models/dtos/contracts/requests/passage_searches/ProcessRequest.ts'
import type ProcessResponse from '../models/dtos/contracts/response/passage_searches/ProcessResponse.ts'

export default class PassageSearchService extends Service {
  client: Client

  path: string

  constructor (client: Client) {
    super()
    this.client = client
    this.path = '/passage-searches'
  }

  async process (request: ProcessRequest): Promise<AxiosResponse<Content<ProcessResponse>>> {
    return await this.client.instance.post(`${this.path}`, request.body)
  }
}
