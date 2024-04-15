import Service from './Service.ts'
import type Client from '../clients/Client.ts'
import BackendOneClient from '../clients/BackendOneClient.ts'
import type CreateOneRequest
  from '../models/value_objects/contracts/requests/managements/web_documents/CreateOneRequest.ts'
import type DeleteOneByIdRequest
  from '../models/value_objects/contracts/requests/managements/web_documents/DeleteOneByIdRequest.ts'
import { type AxiosResponse } from 'axios'
import type ReadOneByIdRequest
  from '../models/value_objects/contracts/requests/managements/web_documents/ReadOneByIdRequest.ts'
import type PatchOneByIdRequest
  from '../models/value_objects/contracts/requests/managements/web_documents/PatchOneById.ts'
import type WebDocument from '../models/entities/WebDocument.ts'
import type Content from '../models/value_objects/contracts/Content.ts'
import type ReadAllByAccountIdRequest
  from '../models/value_objects/contracts/requests/managements/accounts/ReadAllByAccountIdRequest.ts'

export default class WebDocumentService extends Service {
  client: Client

  path: string

  constructor () {
    super()
    this.client = new BackendOneClient()
    this.path = '/documents/webs'
  }

  async createOne (request: CreateOneRequest): Promise<AxiosResponse<Content<WebDocument>>> {
    return await this.client.instance.post(`${this.path}`, request.body)
  }

  async deleteOneById (request: DeleteOneByIdRequest): Promise<AxiosResponse<Content<WebDocument>>> {
    return await this.client.instance.delete(`${this.path}/${request.id}`)
  }

  async readAll (): Promise<AxiosResponse<Content<WebDocument[]>>> {
    return await this.client.instance.get(`${this.path}`)
  }

  async readAllByAccountId (request: ReadAllByAccountIdRequest): Promise<AxiosResponse<Content<WebDocument[]>>> {
    return await this.client.instance.get(`${this.path}?account_id=${request.accountId}`)
  }

  async readOneById (request: ReadOneByIdRequest): Promise<AxiosResponse<Content<WebDocument>>> {
    return await this.client.instance.get(`${this.path}/${request.id}`)
  }

  async patchOneById (request: PatchOneByIdRequest): Promise<AxiosResponse<Content<WebDocument>>> {
    return await this.client.instance.patch(`${this.path}/${request.id}`, request.body)
  }
}
