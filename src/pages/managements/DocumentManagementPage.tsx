import DocumentService from "../../services/DocumentService.ts";
import DocumentTypeService from "../../services/DocumentTypeService.ts";
import domainSlice, {DomainState} from "../../slices/DomainSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../slices/Store.ts";
import authenticationSlice, {AuthenticationState} from "../../slices/AuthenticationSlice.ts";
import {useEffect} from "react";
import Content from "../../models/value_objects/contracts/Content.ts";

import Document from "../../models/entities/Document.ts";
import DocumentType from "../../models/entities/DocumentType.ts";
import {useNavigate} from "react-router-dom";
import DetailModalComponent from "../../components/managements/documents/DetailModalComponent.tsx";

export default function DocumentManagementPage() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const documentService = new DocumentService();
    const documentTypeService = new DocumentTypeService();

    const domainState: DomainState = useSelector((state: RootState) => state.domain);
    const authenticationState: AuthenticationState = useSelector((state: RootState) => state.authentication);
    const {account} = authenticationState;
    const {
        accountDocuments,
        documentTypes
    } = domainState.documentDomain;
    const {
        name,
        isShow
    } = domainState.modalDomain;

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        Promise.all([
            documentService
                .readAllByAccountId({
                    accountId: account?.id
                }),
            documentTypeService
                .readAll()
        ])
            .then((response) => {
                const accountDocumentsContent: Content<Document[]> = response[0].data;
                const documentTypesContent: Content<DocumentType[]> = response[1].data;
                dispatch(domainSlice.actions.setDocumentDomain({
                    accountDocuments: accountDocumentsContent.data,
                    documentTypes: documentTypesContent.data
                }))
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleClickLogout = () => {
        dispatch(authenticationSlice.actions.logout())
        navigate("/authentications/login")
    }

    const handleClickDetail = (document: Document) => {
        dispatch(domainSlice.actions.setModalDomain({
            name: "detail",
            isShow: true,
        }))
        dispatch(domainSlice.actions.setCurrentDomain({
            document: document,
            documentType: documentTypes?.find((documentType) => {
                return documentType.id === document.documentTypeId
            })
        }))
    }

    const handleClickDelete = (document: Document) => {
        documentService
            .deleteOneById({
                id: document.id
            })
            .then((response) => {
                const content: Content<Document> = response.data;
                dispatch(domainSlice.actions.setDocumentDomain({
                    accountDocuments: accountDocuments?.filter((document) => {
                        return document.id !== content.data.id
                    })
                }))
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center p-5">
            {name === "detail" && <DetailModalComponent/>}
            <h1>Document Management Page</h1>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Type Name</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {
                    accountDocuments?.map((document) => {
                        return (
                            <tr key={document.id}>
                                <td>{document.id}</td>
                                <td>{document.name}</td>
                                <td>{document.description}</td>
                                <td>
                                    {
                                        documentTypes?.find((documentType) => {
                                            return documentType.id === document.documentTypeId
                                        })?.name
                                    }
                                </td>
                                <td>
                                    <button className="btn btn-primary mx-3"
                                            onClick={() => handleClickDetail(document)}>Detail
                                    </button>
                                    <button className="btn btn-danger"
                                            onClick={() => handleClickDelete(document)}>Delete
                                    </button>
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
            <button className="btn btn-danger mt-5" onClick={handleClickLogout}>Logout</button>
        </div>
    )
}