import { useSelector } from 'react-redux'
import { type AuthenticationState } from '../slices/AuthenticationSlice.ts'
import { type RootState } from '../slices/StoreConfiguration.ts'
import React from 'react'
import UnAuthenticatedRoute from './UnAuthenticatedRoute.tsx'
import AuthenticatedRoute from './AuthenticatedRoute.tsx'
import { BrowserRouter } from 'react-router-dom'

export default function RootRoute (): React.JSX.Element {
  const authenticationState: AuthenticationState = useSelector((state: RootState) => state.authentication)
  const { isLoggedIn } = authenticationState

  return (
        <BrowserRouter>
            {isLoggedIn! ? <AuthenticatedRoute/> : <UnAuthenticatedRoute/>}
        </BrowserRouter>
  )
}
