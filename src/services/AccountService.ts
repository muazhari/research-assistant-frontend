import Service from './Service.ts'
import type Client from '../clients/Client.ts'
import type CreateOne from '../models/dtos/contracts/requests/managements/accounts/CreateOne.ts'
import type DeleteOneById from '../models/dtos/contracts/requests/managements/accounts/DeleteOneById.ts'
import { type AxiosResponse } from 'axios'
import type FindOneById from '../models/dtos/contracts/requests/managements/accounts/FindOneById.ts'
import type PatchOneByIdRequest from '../models/dtos/contracts/requests/managements/accounts/PatchOneById.ts'
import type Account from '../models/daos/Account.ts'
import type Content from '../models/dtos/contracts/Content.ts'
import type FindManyWithPagination
  from '../models/dtos/contracts/requests/managements/accounts/FindManyWithPagination.ts'

export default class AccountService extends Service {
  client: Client

  path: string

  constructor (client: Client) {
    super()
    this.client = client
    this.path = '/accounts'
  }

  async createOne (request: CreateOne): Promise<AxiosResponse<Content<Account>>> {
    return await this.client.instance.post(`${this.path}`, request.body)
  }

  async deleteOneById (request: DeleteOneById): Promise<AxiosResponse<Content<Account>>> {
    return await this.client.instance.delete(`${this.path}/${request.id}`)
  }

  async findManyWithPagination (request: FindManyWithPagination): Promise<AxiosResponse<Content<Account[]>>> {
    return await this.client.instance.get(`${this.path}?page_position=${request.pagePosition}&page_size=${request.pageSize}`)
  }

  async findOneById (request: FindOneById): Promise<AxiosResponse<Content<Account>>> {
    return await this.client.instance.get(`${this.path}/${request.id}`)
  }

  async patchOneById (request: PatchOneByIdRequest): Promise<AxiosResponse<Content<Account>>> {
    return await this.client.instance.patch(`${this.path}/${request.id}`, request.body)
  }
}
