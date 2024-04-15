import Service from './Service.ts'
import type Client from '../clients/Client.ts'
import BackendOneClient from '../clients/BackendOneClient.ts'
import type CreateOneRequest
  from '../models/value_objects/contracts/requests/managements/file_documents/CreateOneRequest.ts'
import type DeleteOneByIdRequest
  from '../models/value_objects/contracts/requests/managements/file_documents/DeleteOneByIdRequest.ts'
import { type AxiosResponse } from 'axios'
import type ReadOneByIdRequest
  from '../models/value_objects/contracts/requests/managements/file_documents/ReadOneByIdRequest.ts'
import type PatchOneByIdRequest
  from '../models/value_objects/contracts/requests/managements/file_documents/PatchOneById.ts'
import type FileDocument from '../models/entities/FileDocument.ts'
import type Content from '../models/value_objects/contracts/Content.ts'
import type ReadAllByAccountIdRequest
  from '../models/value_objects/contracts/requests/managements/accounts/ReadAllByAccountIdRequest.ts'
import type FileDocumentPropertyResponse
  from '../models/value_objects/contracts/response/managements/FileDocumentPropertyResponse.ts'

export default class FileDocumentService extends Service {
  client: Client

  path: string

  constructor () {
    super()
    this.client = new BackendOneClient()
    this.path = '/documents/files'
  }

  async createOne (request: CreateOneRequest): Promise<AxiosResponse<Content<FileDocument>>> {
    return await this.client.instance.post(`${this.path}`, request.body)
  }

  async deleteOneById (request: DeleteOneByIdRequest): Promise<AxiosResponse<Content<FileDocument>>> {
    return await this.client.instance.delete(`${this.path}/${request.id}`)
  }

  async readAll (): Promise<AxiosResponse<Content<FileDocument[]>>> {
    return await this.client.instance.get(`${this.path}`)
  }

  async readAllByAccountId (request: ReadAllByAccountIdRequest): Promise<AxiosResponse<Content<FileDocument[]>>> {
    return await this.client.instance.get(`${this.path}?account_id=${request.accountId}`)
  }

  async readOneById (request: ReadOneByIdRequest): Promise<AxiosResponse<Content<FileDocument>>> {
    return await this.client.instance.get(`${this.path}/${request.id}`)
  }

  async readOnePropertyById (request: ReadOneByIdRequest): Promise<AxiosResponse<Content<FileDocumentPropertyResponse>>> {
    return await this.client.instance.get(`${this.path}/${request.id}/property`)
  }

  async patchOneById (request: PatchOneByIdRequest): Promise<AxiosResponse<Content<FileDocument>>> {
    return await this.client.instance.patch(`${this.path}/${request.id}`, request.body)
  }
}
