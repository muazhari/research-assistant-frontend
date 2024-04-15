import { createSlice } from '@reduxjs/toolkit'
import type Account from '../models/entities/Account.ts'
import storage from 'redux-persist/lib/storage'

export interface AuthenticationState {
  account?: Account
  isLoggedIn?: boolean
}

const initialState: AuthenticationState = {
  account: undefined,
  isLoggedIn: false
}

export default createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    login: (state, action) => {
      state.account = action.payload
      state.isLoggedIn = true
    },
    logout: (state) => {
      state.account = undefined
      state.isLoggedIn = false
      storage
        .removeItem('persist')
        .then()
        .catch((error) => {
          console.log(error)
        })
    },
    register: (state, action) => {
      state.account = action.payload
      state.isLoggedIn = false
    }
  }
})
