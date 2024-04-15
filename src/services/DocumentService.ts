import Service from './Service.ts'
import type Client from '../clients/Client.ts'
import BackendOneClient from '../clients/BackendOneClient.ts'
import type CreateOneRequest from '../models/dtos/contracts/requests/managements/documents/CreateOneRequest.ts'
import type DeleteOneByIdRequest from '../models/dtos/contracts/requests/managements/documents/DeleteOneByIdRequest.ts'
import { type AxiosResponse } from 'axios'
import type ReadOneByIdRequest from '../models/dtos/contracts/requests/managements/documents/ReadOneByIdRequest.ts'
import type PatchOneByIdRequest from '../models/dtos/contracts/requests/managements/documents/PatchOneById.ts'
import type Document from '../models/daos/Document.ts'
import type Content from '../models/dtos/contracts/Content.ts'
import type ReadAllByAccountIdRequest
  from '../models/dtos/contracts/requests/managements/accounts/ReadAllByAccountIdRequest.ts'

export default class DocumentService extends Service {
  client: Client

  path: string

  constructor () {
    super()
    this.client = new BackendOneClient()
    this.path = '/documents'
  }

  async createOne (request: CreateOneRequest): Promise<AxiosResponse<Content<Document>>> {
    return await this.client.instance.post(`${this.path}`, request.body)
  }

  async deleteOneById (request: DeleteOneByIdRequest): Promise<AxiosResponse<Content<Document>>> {
    return await this.client.instance.delete(`${this.path}/${request.id}`)
  }

  async readAll (): Promise<AxiosResponse<Content<Document[]>>> {
    return await this.client.instance.get(`${this.path}`)
  }

  async readAllByAccountId (request: ReadAllByAccountIdRequest): Promise<AxiosResponse<Content<Document[]>>> {
    return await this.client.instance.get(`${this.path}?account_id=${request.accountId}`)
  }

  async readOneById (request: ReadOneByIdRequest): Promise<AxiosResponse<Content<Document>>> {
    return await this.client.instance.get(`${this.path}/${request.id}`)
  }

  async patchOneById (request: PatchOneByIdRequest): Promise<AxiosResponse<Content<Document>>> {
    return await this.client.instance.patch(`${this.path}/${request.id}`, request.body)
  }
}
