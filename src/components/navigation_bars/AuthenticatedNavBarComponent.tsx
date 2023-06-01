import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import DocumentService from "../../services/DocumentService.ts";
import DocumentTypeService from "../../services/DocumentTypeService.ts";
import {DomainState} from "../../slices/DomainSlice.ts";
import {RootState} from "../../slices/Store.ts";
import authenticationSlice, {AuthenticationState} from "../../slices/AuthenticationSlice.ts";
import {useNavigate} from "react-router-dom";


export default function AuthenticatedNavBarComponent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const documentService = new DocumentService();
    const documentTypeService = new DocumentTypeService();

    const domainState: DomainState = useSelector((state: RootState) => state.domain);
    const authenticationState: AuthenticationState = useSelector((state: RootState) => state.authentication);
    const {isLoggedIn} = authenticationState;

    const handleClickLogout = () => {
        dispatch(authenticationSlice.actions.logout())
        navigate("/authentications/login")
    }

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/">Research Assistant</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav" className={"d-flex justify-content-between"}>
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