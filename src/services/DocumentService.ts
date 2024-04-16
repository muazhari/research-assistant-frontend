import Service from './Service.ts'
import type Client from '../clients/Client.ts'
import type CreateOne from '../models/dtos/contracts/requests/managements/documents/CreateOne.ts'
import type DeleteOneById from '../models/dtos/contracts/requests/managements/documents/DeleteOneById.ts'
import {type AxiosResponse} from 'axios'
import type FindOneById from '../models/dtos/contracts/requests/managements/documents/FindOneById.ts'
import type PatchOneById from '../models/dtos/contracts/requests/managements/documents/PatchOneById.ts'
import type Document from '../models/daos/Document.ts'
import type Content from '../models/dtos/contracts/Content.ts'
import type FindManyWithPagination
  from '../models/dtos/contracts/requests/managements/documents/FindManyWithPagination.ts'

export default class DocumentService extends Service {
  client: Client

  path: string

  constructor (client: Client) {
    super()
    this.client = client
    this.path = '/documents'
  }

  async createOne (request: CreateOne): Promise<AxiosResponse<Content<Document>>> {
    return await this.client.instance.post(`${this.path}`, request.body)
  }

  async deleteOneById (request: DeleteOneById): Promise<AxiosResponse<Content<Document>>> {
    return await this.client.instance.delete(`${this.path}/${request.id}`)
  }

  async findManyWithPagination (request: FindManyWithPagination): Promise<AxiosResponse<Content<Document[]>>> {
    return await this.client.instance.get(`${this.path}?page_position=${request.pagePosition}&page_size=${request.pageSize}`)
  }

  async findOneById (request: FindOneById): Promise<AxiosResponse<Content<Document>>> {
    return await this.client.instance.get(`${this.path}/${request.id}`)
  }

  async patchOneById (request: PatchOneById): Promise<AxiosResponse<Content<Document>>> {
    return await this.client.instance.patch(`${this.path}/${request.id}`, request.body)
  }
}
