import {Route, Routes} from "react-router-dom";
import DocumentManagementPage from "../pages/managements/DocumentManagementPage.tsx";
import NotFoundPage from "../pages/NotFound.tsx";

export default function AuthenticatedRouter() {


    return (
        <Routes>
            <Route path="/managements/documents" element={<DocumentManagementPage/>}/>
            <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
    )
}