import Service from './Service.ts'
import type Client from '../clients/Client.ts'
import type CreateOne from '../models/dtos/contracts/requests/managements/file_documents/CreateOne.ts'
import type DeleteOneById from '../models/dtos/contracts/requests/managements/file_documents/DeleteOneById.ts'
import {type AxiosResponse} from 'axios'
import type FindOneById from '../models/dtos/contracts/requests/managements/file_documents/FindOneById.ts'
import type PatchOneByIdRequest from '../models/dtos/contracts/requests/managements/file_documents/PatchOneById.ts'
import type FileDocument from '../models/daos/FileDocument.ts'
import type Content from '../models/dtos/contracts/Content.ts'
import type FindManyWithPagination
  from '../models/dtos/contracts/requests/managements/file_documents/FindManyWithPagination.ts'

export default class FileDocumentService extends Service {
  client: Client

  path: string

  constructor (client: Client) {
    super()
    this.client = client
    this.path = '/documents/files'
  }

  async createOne (request: CreateOne): Promise<AxiosResponse<Content<FileDocument>>> {
    const data: FormData = new FormData()
    for (const entry of Object.entries(request.body!)) {
      if (entry[1] === undefined) {
        continue
      }
      data.append(entry[0], entry[1] as string | Blob)
    }
    return await this.client.instance.post(
      this.path,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
  }

  async deleteOneById (request: DeleteOneById): Promise<AxiosResponse<Content<FileDocument>>> {
    return await this.client.instance.delete(`${this.path}/${request.id}`)
  }

  async findManyWithPagination (request: FindManyWithPagination): Promise<AxiosResponse<Content<FileDocument[]>>> {
    return await this.client.instance.get(`${this.path}?&page_position=${request.pagePosition}&page_size=${request.pageSize}`)
  }

  async findOneById (request: FindOneById): Promise<AxiosResponse<Content<FileDocument>>> {
    return await this.client.instance.get(`${this.path}/${request.id}`)
  }

  async patchOneById (request: PatchOneByIdRequest): Promise<AxiosResponse<Content<FileDocument>>> {
    const data: FormData = new FormData()
    for (const entry of Object.entries(request.body!)) {
      if (entry[1] === undefined) {
        continue
      }
      data.append(entry[0], entry[1] as string | Blob)
    }
    return await this.client.instance.patch(
        `${this.path}/${request.id}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
    )
  }
}
