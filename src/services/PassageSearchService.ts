import Service from './Service.ts'
import type Client from '../clients/Client.ts'
import BackendOneClient from '../clients/BackendOneClient.ts'
import { type AxiosResponse } from 'axios'
import type Content from '../models/value_objects/contracts/Content.ts'
import type SearchRequest from '../models/value_objects/contracts/requests/passage_searchs/SearchRequest.ts'
import type SearchResponse from '../models/value_objects/contracts/response/passage_searchs/SearchResponse.ts'

export default class PassageSearchService extends Service {
  client: Client

  path: string

  constructor () {
    super()
    this.client = new BackendOneClient()
    this.path = '/passage-search'
  }

  async search (request: SearchRequest): Promise<AxiosResponse<Content<SearchResponse>>> {
    return await this.client.instance.post(`${this.path}`, request)
  }
}
