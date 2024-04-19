import { createSlice } from '@reduxjs/toolkit'
import type Account from '../models/daos/Account.ts'
import storage from 'redux-persist/lib/storage'
import type Session from '../models/daos/Session.ts'

export interface AuthenticationState {
  account?: Account
  session?: Session
  isLoggedIn?: boolean
}

const initialState: AuthenticationState = {
  account: undefined,
  session: undefined,
  isLoggedIn: false
}

export default createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    login: (state, action) => {
      storage
        .removeItem('persistence')
        .then()
        .catch((error) => {
          console.error(error)
        })
      state.account = action.payload.account
      state.session = action.payload.session
      state.isLoggedIn = true
    },
    setSession: (state, action) => {
      state.session = action.payload
    },
    logout: (state) => {
      state.account = undefined
      state.session = undefined
      state.isLoggedIn = false
      storage
        .removeItem('persistence')
        .then()
        .catch((error) => {
          console.error(error)
        })
    },
    register: (state, action) => {
      state.account = action.payload
      state.isLoggedIn = false
    }
  }
})
