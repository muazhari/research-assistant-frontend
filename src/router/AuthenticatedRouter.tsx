import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import DocumentManagementPage from "../pages/managements/DocumentManagementPage.tsx";
import NotFoundPage from "../pages/NotFound.tsx";
import PassageSearch from "../pages/managements/PassageSearch.tsx";
import LongFormQA from "../pages/managements/LongFormQa.tsx";
import AuthenticatedNavBarComponent from "../components/navigation_bars/AuthenticatedNavBarComponent.tsx";

export default function AuthenticatedRouter() {


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