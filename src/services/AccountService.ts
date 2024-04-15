import Service from './Service.ts'
import type Client from '../clients/Client.ts'
import BackendOneClient from '../clients/BackendOneClient.ts'
import type CreateOneRequest from '../models/value_objects/contracts/requests/managements/accounts/CreateOneRequest.ts'
import type DeleteOneByIdRequest
  from '../models/value_objects/contracts/requests/managements/accounts/DeleteOneByIdRequest.ts'
import { type AxiosResponse } from 'axios'
import type ReadOneByIdRequest
  from '../models/value_objects/contracts/requests/managements/accounts/ReadOneByIdRequest.ts'
import type PatchOneByIdRequest from '../models/value_objects/contracts/requests/managements/accounts/PatchOneById.ts'
import type Account from '../models/entities/Account.ts'
import type Content from '../models/value_objects/contracts/Content.ts'

export default class AccountService extends Service {
  client: Client

  path: string

  constructor () {
    super()
    this.client = new BackendOneClient()
    this.path = '/accounts'
  }

  async createOne (request: CreateOneRequest): Promise<AxiosResponse<Content<Account>>> {
    return await this.client.instance.post(`${this.path}`, request.body)
  }

  async deleteOneById (request: DeleteOneByIdRequest): Promise<AxiosResponse<Content<Account>>> {
    return await this.client.instance.delete(`${this.path}/${request.id}`)
  }

  async readAll (): Promise<AxiosResponse<Content<Account[]>>> {
    return await this.client.instance.get(`${this.path}`)
  }

  async readOneById (request: ReadOneByIdRequest): Promise<AxiosResponse<Content<Account>>> {
    return await this.client.instance.get(`${this.path}/${request.id}`)
  }

  async patchOneById (request: PatchOneByIdRequest): Promise<AxiosResponse<Content<Account>>> {
    return await this.client.instance.patch(`${this.path}/${request.id}`, request.body)
  }
}
