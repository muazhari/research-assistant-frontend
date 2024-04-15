import type Client from '../clients/Client.ts'

export default abstract class Service {
  abstract client: Client
  abstract path: string
}
