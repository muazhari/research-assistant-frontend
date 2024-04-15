import { useFormik } from 'formik'

import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import AuthenticationService from '../../services/AuthenticationService.ts'
import type Content from '../../models/value_objects/contracts/Content.ts'
import type LoginResponse from '../../models/value_objects/contracts/response/authentications/LoginResponse.ts'
import authenticationSlice from '../../slices/AuthenticationSlice.ts'
import { useDispatch } from 'react-redux'
import React from 'react'

export default function LoginPage (): React.JSX.Element {
  const authenticationService = new AuthenticationService()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
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
          const content: Content<LoginResponse> = response.data
          alert(content.message)
          dispatch(authenticationSlice.actions.login(content.data!.account))
          navigate('/managements/documents')
        }
        )
        .catch((error) => {
          console.log(error)
        })
    }
  })

  return (
        <div className="d-flex flex-column justify-content-center align-items-center flex-wrap p-5">
            <h1 className="mb-5">Login Page</h1>
            <form onSubmit={formik.handleSubmit} className="d-flex flex-column flex-wrap">
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
                        (formik.errors.email != null) && (formik.touched.email === true)
                          ? <div className="text-danger">{formik.errors.email}</div>
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
                        (formik.errors.password != null) && (formik.touched.password === true)
                          ? <div className="text-danger">{formik.errors.password}</div>
                          : null
                    }
                </fieldset>
                <div className="mb-3">Did not have any account?{' '}
                    <Link to={'/authentications/register'}>
                        Register here
                    </Link>.
                </div>
                <button className="btn btn-primary" type="submit">Login</button>
            </form>
        </div>
  )
}
