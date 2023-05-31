import {Route, Routes} from "react-router-dom";
import LoginPage from "../pages/authentications/LoginPage.tsx";
import RegisterPage from "../pages/authentications/RegisterPage.tsx";
import NotFoundPage from "../pages/NotFound.tsx";

export default function UnAuthenticatedRouter() {


    return (
        <Routes>
            <Route index path="/authentications/login" element={<LoginPage/>}/>
            <Route path="/authentications/register" element={<RegisterPage/>}/>
            <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
    )
}