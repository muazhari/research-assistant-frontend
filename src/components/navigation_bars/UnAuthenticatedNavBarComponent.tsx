import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import React from 'react'

export default function UnAuthenticatedNavBarComponent (): React.JSX.Element {
  return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/">Research Assistant</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        <NavDropdown title="Authentications">
                            <NavDropdown.Item href="/authentications/login">Login</NavDropdown.Item>
                            <NavDropdown.Item href="/authentications/register">Register</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
  )
}
