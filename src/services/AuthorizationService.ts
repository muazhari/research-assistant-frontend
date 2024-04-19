import Service from './Service.ts'
import type Client from '../clients/Client.ts'
import type Content from '../models/dtos/contracts/Content.ts'
import { type AxiosResponse } from 'axios'
import type Session from '../models/daos/Session.ts'
import type RefreshAccessToken from '../models/dtos/contracts/requests/authorizations/RefreshAccessToken.ts'

export default class AuthorizationService extends Service {
  client: Client

  path: string

  constructor (client: Client) {
    super()
    this.client = client
    this.path = '/authorizations'
  }

  async refreshAccessToken (request: RefreshAccessToken): Promise<AxiosResponse<Content<Session>>> {
    return await this.client.instance.post(`${this.path}/refreshes?token_type=access-token`, request.body)
  }
}
