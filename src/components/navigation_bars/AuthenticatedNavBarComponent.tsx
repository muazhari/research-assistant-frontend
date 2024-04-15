import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import authenticationSlice from '../../slices/AuthenticationSlice.ts'
import { useNavigate } from 'react-router-dom'
import React from 'react'

export default function AuthenticatedNavBarComponent (): React.JSX.Element {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleClickLogout = (): void => {
    dispatch(authenticationSlice.actions.logout())
    navigate('/authentications/login')
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
                    <button className="btn btn-danger" onClick={handleClickLogout}>Logout</button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
  )
}
