import { useFormik } from 'formik'

import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import type Content from '../../models/dtos/contracts/Content.ts'
import type LoginResponse from '../../models/dtos/contracts/response/authentications/LoginResponse.ts'
import authenticationSlice from '../../slices/AuthenticationSlice.ts'
import { useDispatch, useSelector } from 'react-redux'
import React from 'react'

import { authenticationService } from '../../containers/ServiceContainer.ts'
import type { ProcessState } from '../../slices/ProcessSlice.ts'
import type { RootState } from '../../slices/StoreConfiguration.ts'

export default function LoginPage (): React.JSX.Element {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const processState: ProcessState = useSelector((state: RootState) => state.process)

  const {
    isLoading
  } = processState

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
          dispatch(authenticationSlice.actions.login({
            account: content.data!.account,
            session: content.data!.session
          }))
          navigate('/managements/documents')
        }
        )
        .catch((error) => {
          console.error(error)
          alert(JSON.stringify(error.response.data, null, 2))
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
                        (formik.errors.email !== null && formik.touched.email === true) &&
                        <div className="text-danger">{formik.errors.email}</div>
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
                        (formik.errors.password !== null && formik.touched.password === true) &&
                        <div className="text-danger">{formik.errors.password}</div>
                    }
                </fieldset>
                <div className="mb-3">Did not have any account?{' '}
                    <Link to={'/authentications/register'}>
                        Register here
                    </Link>.
                </div>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {
                        isLoading!
                          ? <div className="spinner-border text-light" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                          : 'Login'
                    }
                </button>
            </form>
        </div>
  )
}
