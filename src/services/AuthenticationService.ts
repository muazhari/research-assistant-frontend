import Service from './Service.ts'
import type Client from '../clients/Client.ts'
import type Content from '../models/value_objects/contracts/Content.ts'
import type LoginRequest from '../models/value_objects/contracts/requests/authentications/LoginRequest.ts'
import type RegisterRequest from '../models/value_objects/contracts/requests/authentications/RegisterRequest.ts'
import type LoginResponse from '../models/value_objects/contracts/response/authentications/LoginResponse.ts'
import type RegisterResponse from '../models/value_objects/contracts/response/authentications/RegisterResponse.ts'
import BackendOneClient from '../clients/BackendOneClient.ts'
import { type AxiosResponse } from 'axios'

export default class AuthenticationService extends Service {
  client: Client

  path: string

  constructor () {
    super()
    this.client = new BackendOneClient()
    this.path = '/authentications'
  }

  async login (request: LoginRequest): Promise<AxiosResponse<Content<LoginResponse>>> {
    return await this.client.instance.post(`${this.path}/logins/email-and-password`, request.body)
  }

  async register (request: RegisterRequest): Promise<AxiosResponse<Content<RegisterResponse>>> {
    return await this.client.instance.post(`${this.path}/registers/email-and-password`, request.body)
  }
}
