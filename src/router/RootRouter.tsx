import { useSelector } from 'react-redux'
import { type AuthenticationState } from '../slices/AuthenticationSlice.ts'
import { type RootState } from '../slices/Store.ts'
import React from 'react'
import UnAuthenticatedRouter from './UnAuthenticatedRouter.tsx'
import AuthenticatedRouter from './AuthenticatedRouter.tsx'

export default function RootRouter (): React.JSX.Element {
  const authenticationState: AuthenticationState = useSelector((state: RootState) => state.authentication)
  const { isLoggedIn } = authenticationState

  return (
        <div>
            {isLoggedIn! ? <AuthenticatedRouter/> : <UnAuthenticatedRouter/>}
        </div>
  )
}
