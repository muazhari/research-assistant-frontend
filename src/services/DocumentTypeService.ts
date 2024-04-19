import Service from './Service.ts'
import type Client from '../clients/Client.ts'
import { type AxiosResponse } from 'axios'
import type FindOneById from '../models/dtos/contracts/requests/managements/document_types/FindOneById.ts'
import type PatchOneById from '../models/dtos/contracts/requests/managements/document_types/PatchOneById.ts'
import type DocumentType from '../models/daos/DocumentType.ts'
import type Content from '../models/dtos/contracts/Content.ts'

export default class DocumentTypeService extends Service {
  client: Client

  path: string

  constructor (client: Client) {
    super()
    this.client = client
    this.path = '/document-types'
  }

  async findOneById (request: FindOneById): Promise<AxiosResponse<Content<DocumentType>>> {
    return await this.client.instance.get(`${this.path}/${request.id}`)
  }

  async patchOneById (request: PatchOneById): Promise<AxiosResponse<Content<DocumentType>>> {
    return await this.client.instance.patch(`${this.path}/${request.id}`, request.body)
  }
}
