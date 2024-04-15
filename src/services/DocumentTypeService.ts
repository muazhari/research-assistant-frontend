import Service from './Service.ts'
import type Client from '../clients/Client.ts'
import BackendOneClient from '../clients/BackendOneClient.ts'
import type CreateOneRequest from '../models/dtos/contracts/requests/managements/document_types/CreateOneRequest.ts'
import type DeleteOneByIdRequest
  from '../models/dtos/contracts/requests/managements/document_types/DeleteOneByIdRequest.ts'
import { type AxiosResponse } from 'axios'
import type ReadOneByIdRequest from '../models/dtos/contracts/requests/managements/document_types/ReadOneByIdRequest.ts'
import type PatchOneByIdRequest from '../models/dtos/contracts/requests/managements/document_types/PatchOneById.ts'
import type DocumentType from '../models/daos/DocumentType.ts'
import type Content from '../models/dtos/contracts/Content.ts'

export default class DocumentTypeService extends Service {
  client: Client

  path: string

  constructor () {
    super()
    this.client = new BackendOneClient()
    this.path = '/document-types'
  }

  async createOne (request: CreateOneRequest): Promise<AxiosResponse<Content<DocumentType>>> {
    return await this.client.instance.post(`${this.path}`, request.body)
  }

  async deleteOneById (request: DeleteOneByIdRequest): Promise<AxiosResponse<Content<DocumentType>>> {
    return await this.client.instance.delete(`${this.path}/${request.id}`)
  }

  async readAll (): Promise<AxiosResponse<Content<DocumentType[]>>> {
    return await this.client.instance.get(`${this.path}`)
  }

  async readOneById (request: ReadOneByIdRequest): Promise<AxiosResponse<Content<DocumentType>>> {
    return await this.client.instance.get(`${this.path}/${request.id}`)
  }

  async patchOneById (request: PatchOneByIdRequest): Promise<AxiosResponse<Content<DocumentType>>> {
    return await this.client.instance.patch(`${this.path}/${request.id}`, request.body)
  }
}
