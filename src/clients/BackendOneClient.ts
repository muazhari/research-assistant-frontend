import ClientSetting from '../settings/ClientSetting.ts'
import Client from './Client.ts'
import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import applyCaseMiddleware from 'axios-case-converter'
import { store } from '../slices/Store.ts'
import type Content from '../models/dtos/contracts/Content.ts'
import type Session from '../models/daos/Session.ts'
import authenticationSlice from '../slices/AuthenticationSlice.ts'
import * as serviceContainer from '../containers/ServiceContainer.ts'

export default class BackendOneClient extends Client {
  instance: AxiosInstance

  clientSetting: ClientSetting

  constructor () {
    super()
    this.clientSetting = new ClientSetting(
      process.env.FARM_API_URL_BACKEND_ONE
    )
    const { authentication: authenticationState } = store.getState()
    this.instance = axios.create({
      baseURL: this.clientSetting.URL
    })
    this.instance = applyCaseMiddleware(this.instance)
    const unAuthenticatedPaths: string[] = [
      '/authentications/logins',
      '/authentications/registers'
    ]
    this.instance.interceptors.request.use(
      config => {
        config.headers['Access-Control-Allow-Origin'] = '*'
        let isUnAuthenticatedPath = false
        for (const unauthenticatedPath of unAuthenticatedPaths) {
          if (config.url!.includes(unauthenticatedPath)) {
            isUnAuthenticatedPath = true
            break
          }
        }
        if (!isUnAuthenticatedPath && authenticationState.session !== undefined) {
          config.headers.Authorization = `Bearer ${authenticationState.session.accessToken}`
        }

        return config
      }
    )
    this.instance.interceptors.response.use(
      response => response,
      async error => {
        console.log(error)
        alert(JSON.stringify(error))
        if (error !== undefined) {
          const errorContent: Content<null> = error.response.data
          if (error.response.status === 401 && errorContent.message!.includes('Access token is expired')) {
            const refreshAccessTokenResponse: AxiosResponse<Content<Session>> = await serviceContainer.authorization.refreshAccessToken(
              {
                body: {
                  refreshToken: authenticationState.session!.refreshToken
                }
              }
            )
            const refreshAccessTokenContent: Content<Session> = refreshAccessTokenResponse.data
            if (refreshAccessTokenResponse.status === 200) {
              store.dispatch(authenticationSlice.actions.setSession(refreshAccessTokenContent.data))
              const originalRequest = error.config
              originalRequest.headers.Authorization = `Bearer ${refreshAccessTokenContent.data!.accessToken}`
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              return await this.instance(originalRequest)
            }
          }
        }

        return await Promise.reject(error)
      }
    )
  }
}
