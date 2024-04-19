import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import authenticationSlice from '../../slices/AuthenticationSlice.ts'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import { authenticationService } from '../../containers/ServiceContainer.ts'
import processSlice from '../../slices/ProcessSlice.ts'
import type Content from '../../models/dtos/contracts/Content.ts'
import { type RootState } from '../../slices/StoreConfiguration.ts'

export default function AuthenticatedNavBarComponent (): React.JSX.Element {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const processState = useSelector((state: RootState) => state.process)
  const {
    isLoading
  } = processState

  const handleClickLogout = (): void => {
    dispatch(processSlice.actions.set({
      isLoading: true
    }))
    authenticationService
      .logout()
      .then(() => {
        dispatch(authenticationSlice.actions.logout())
        navigate('/authentications/login')
      })
      .catch((error) => {
        console.error(error)
        const content: Content<null> = error.response.data
        alert(content.message)
      })
      .finally(() => {
        dispatch(processSlice.actions.set({
          isLoading: false
        }))
      })
  }

  return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/">Research Assistant</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav" className={'d-flex justify-content-between'}>
                    <Nav>
                        <NavDropdown title="Features">
                            <NavDropdown.Item href="/features/passage-search">Passage Search</NavDropdown.Item>
                            <NavDropdown.Item href="/features/long-form-qa">Long Form QA</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Managements">
                            <NavDropdown.Item href="/managements/documents">Documents</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <button className="btn btn-danger" onClick={handleClickLogout} disabled={isLoading}>
                    {
                        isLoading!
                          ? <div className="spinner-border text-light" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                          : 'Logout'
                    }
                </button>
            </Navbar.Collapse>
        </Container>
</Navbar>
  )
}
