import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/authentications/LoginPage.tsx'
import RegisterPage from '../pages/authentications/RegisterPage.tsx'
import NotFoundPage from '../pages/NotFound.tsx'
import UnAuthenticatedNavBarComponent from '../components/navigation_bars/UnAuthenticatedNavBarComponent.tsx'
import React from 'react'

export default function UnAuthenticatedRoute (): React.JSX.Element {
  return (
        <>
            <UnAuthenticatedNavBarComponent/>
            <Routes>
                <Route index path="/" element={<Navigate to="/authentications/login"/>}/>
                <Route path="/authentications/login" element={<LoginPage/>}/>
                <Route path="/authentications/register" element={<RegisterPage/>}/>
                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </>
  )
}
