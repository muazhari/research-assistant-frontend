import {useFormik} from "formik";

import * as Yup from 'yup';
import {Link, redirect, useNavigate} from "react-router-dom";
import AuthenticationService from "../../services/AuthenticationService.ts";
import Content from "../../models/value_objects/contracts/Content.ts";
import LoginResponse from "../../models/value_objects/contracts/response/authentications/LoginResponse.ts";
import authenticationSlice from "../../slices/AuthenticationSlice.ts";
import {useDispatch} from "react-redux";

export default function LoginPage() {
    const authenticationService = new AuthenticationService();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: Yup.object({
            email: Yup.string().email().required(),
            password: Yup.string().required()
        }),
        onSubmit: (values) => {
            authenticationService
                .login({
                    body: {
                        email: values.email,
                        password: values.password
                    }
                })
                .then((response) => {
                        const content: Content<LoginResponse> = response.data;
                        alert(content.message)
                        dispatch(authenticationSlice.actions.login(content.data.account))
                        navigate("/managements/documents")
                    }
                )
                .catch((error) => {
                    alert(error)
                })
        },
    })

    return (
        <div className="d-flex flex-wrap flex-column p-5 justify-content-center align-items-center">
            <h1 className="mb-5">Login Page</h1>
            <form onSubmit={formik.handleSubmit} className="d-flex flex-wrap flex-column">
                <fieldset className="mb-2">
                    <label className="form-label" htmlFor="email">Email:</label>
                    <input
                        className="form-control"
                        type="email"
                        id="email"
                        name="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                    />
                    {
                        formik.errors.email && formik.touched.email ?
                            <div className="text-danger">{formik.errors.email}</div>
                            : null
                    }
                </fieldset>
                <fieldset className="mb-3">
                    <label className="form-label" htmlFor="password">Password:</label>
                    <input
                        className="form-control"
                        type="password"
                        id="password"
                        name="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                    />
                    {
                        formik.errors.password && formik.touched.password ?
                            <div className="text-danger">{formik.errors.password}</div>
                            : null
                    }
                </fieldset>
                <div className="mb-3">Did not have any account?{" "}
                    <Link to={"/authentications/register"}>
                        Register here
                    </Link>.
                </div>
                <button className="btn btn-primary" type="submit">Login</button>
            </form>
        </div>
    )
}
