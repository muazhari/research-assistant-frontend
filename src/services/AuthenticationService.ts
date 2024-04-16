import Service from './Service.ts'
import type Client from '../clients/Client.ts'
import type Content from '../models/dtos/contracts/Content.ts'
import type Login from '../models/dtos/contracts/requests/authentications/Login.ts'
import type Register from '../models/dtos/contracts/requests/authentications/Register.ts'
import type LoginResponse from '../models/dtos/contracts/response/authentications/LoginResponse.ts'
import type RegisterResponse from '../models/dtos/contracts/response/authentications/RegisterResponse.ts'
import {type AxiosResponse} from 'axios'

export default class AuthenticationService extends Service {
  client: Client

  path: string

  constructor (client: Client) {
    super()
    this.client = client
    this.path = '/authentications'
  }

  async login (request: Login): Promise<AxiosResponse<Content<LoginResponse>>> {
    return await this.client.instance.post(`${this.path}/logins?method=email-and-password`, request.body)
  }

  async register (request: Register): Promise<AxiosResponse<Content<RegisterResponse>>> {
    return await this.client.instance.post(`${this.path}/registers?method=email-and-password`, request.body)
  }
}
