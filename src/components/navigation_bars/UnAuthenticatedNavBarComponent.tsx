import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import DocumentService from "../../services/DocumentService.ts";
import DocumentTypeService from "../../services/DocumentTypeService.ts";
import {DomainState} from "../../slices/DomainSlice.ts";
import {RootState} from "../../slices/Store.ts";
import {AuthenticationState} from "../../slices/AuthenticationSlice.ts";


export default function UnAuthenticatedNavBarComponent() {
    const dispatch = useDispatch();

    const documentService = new DocumentService();
    const documentTypeService = new DocumentTypeService();

    const domainState: DomainState = useSelector((state: RootState) => state.domain);
    const authenticationState: AuthenticationState = useSelector((state: RootState) => state.authentication);
    const {isLoggedIn} = authenticationState;

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