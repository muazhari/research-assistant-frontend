import {useFormik} from "formik";

import * as Yup from 'yup';
import {Link, useNavigate} from "react-router-dom";
import React from "react";
import AuthenticationService from "../../services/AuthenticationService.ts";
import {useDispatch} from "react-redux";
import Content from "../../models/value_objects/contracts/Content.ts";
import RegisterResponse from "../../models/value_objects/contracts/response/authentications/RegisterResponse.ts";

export default function RegisterPage() {

    const authenticationService = new AuthenticationService();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: ""
        },
        validationSchema: Yup.object({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required()
        }),
        onSubmit: (values) => {
            authenticationService
                .register({
                    body: {
                        name: values.name,
                        email: values.email,
                        password: values.password
                    }
                })
                .then((response) => {
                        const content: Content<RegisterResponse> = response.data;
                        alert(content.message)
                    }
                )
                .catch((error) => {
                    console.log(error)
                })
        },
    })

    return (
        <div className="d-flex flex-wrap flex-column p-5 justify-content-center align-items-center">
            <h1 className="mb-5">Register Page</h1>
            <form onSubmit={formik.handleSubmit} className="d-flex flex-wrap flex-column">
                <fieldset className="mb-2">
                    <label className="form-label" htmlFor="name">Name:</label>
                    <input
                        className="form-control"
                        type="name"
                        id="name"
                        name="name"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.name}
                    />
                    {
                        formik.errors.name && formik.touched.name ?
                            <div className="text-danger">{formik.errors.name}</div>
                            : null
                    }
                </fieldset>
                <fieldset className="mb-2">
                    <label className="form-label" htmlFor="email">Email:</label>
                    <input
                        className="form-control"
                        type="email"
                        id="email"
                        name="email"
                        onBlur={formik.handleBlur}
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
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.password}
                    />
                    {
                        formik.errors.password && formik.touched.password ?
                            <div className="text-danger">{formik.errors.password}</div>
                            : null
                    }
                </fieldset>
                <div className="mb-3">Did have any account?{" "}
                    <Link to={"/authentications/login"}>
                        Login here
                    </Link>.
                </div>
                <button className="btn btn-primary" type="submit">Register</button>
            </form>
        </div>
    )
}
