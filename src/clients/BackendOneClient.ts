import ClientSetting from '../settings/ClientSetting.ts'
import Client from './Client.ts'
import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import applyCaseMiddleware from 'axios-case-converter'
import { store } from '../slices/StoreConfiguration.ts'
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
      import.meta.env.VITE_API_URL_BACKEND_ONE as string
    )
    this.instance = axios.create({
      baseURL: this.clientSetting.URL
    })
    this.instance = applyCaseMiddleware(this.instance)
    const unAuthorizedPaths: string[] = [
      '/authentications/logins',
      '/authentications/registers',
      '/authorizations/refreshes'
    ]
    this.instance.interceptors.request.use(
      async config => {
        config.headers['Access-Control-Allow-Origin'] = '*'
        let isUnAuthorizedPath: boolean = false
        for (const unAuthorizedPath of unAuthorizedPaths) {
          if (config.url!.includes(unAuthorizedPath)) {
            isUnAuthorizedPath = true
            break
          }
        }
        const { authentication: authenticationState } = store.getState()
        if (!isUnAuthorizedPath && authenticationState.session !== undefined) {
          config.headers.Authorization = `Bearer ${authenticationState.session.accessToken}`
        }

        return config
      }
    )
    this.instance.interceptors.response.use(
      response => response,
      async error => {
        if (error !== undefined && error.response !== undefined) {
          const errorContent: Content<null> = error.response.data
          if (error.response.status === 401 && errorContent.message!.includes('Access token is expired')) {
            const { authentication: authenticationState } = store.getState()
            const refreshAccessTokenResponse: AxiosResponse<Content<Session>> = await serviceContainer.authorizationService.refreshAccessToken(
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
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              return await this.instance(originalRequest)
            }
          } else if (error.response.status === 404 && errorContent.message!.includes('SessionRepository')) {
            store.dispatch(authenticationSlice.actions.logout())
            window.location.href = '/authentications/login'
          }
        }

        return await Promise.reject(error)
      }
    )
  }
}
