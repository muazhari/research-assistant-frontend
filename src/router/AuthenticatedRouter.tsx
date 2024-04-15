import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import DocumentManagementPage from '../pages/managements/DocumentManagementPage.tsx'
import NotFoundPage from '../pages/NotFound.tsx'
import PassageSearch from '../pages/features/PassageSearchPage.tsx'
import LongFormQA from '../pages/features/LongFormQaPage.tsx'
import AuthenticatedNavBarComponent from '../components/navigation_bars/AuthenticatedNavBarComponent.tsx'
import React from 'react'

export default function AuthenticatedRouter (): React.JSX.Element {
  return (
        <BrowserRouter>
            <AuthenticatedNavBarComponent/>
            <Routes>
                <Route index path="/" element={<Navigate to="/managements/documents"/>}/>
                <Route path="/managements/documents" element={<DocumentManagementPage/>}/>
                <Route path="/features/passage-search" element={<PassageSearch/>}/>
                <Route path="/features/long-form-qa" element={<LongFormQA/>}/>
                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </BrowserRouter>
  )
}
