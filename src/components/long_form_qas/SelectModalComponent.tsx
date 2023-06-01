import {Modal, ModalBody, ModalHeader} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import Document from "../../models/entities/Document.ts";
import DocumentType from "../../models/entities/DocumentType.ts";
import FileDocumentService from "../../services/FileDocumentService.ts";
import TextDocumentService from "../../services/TextDocumentService.ts";
import WebDocumentService from "../../services/WebDocumentService.ts";
import {AuthenticationState} from "../../slices/AuthenticationSlice.ts";
import domainSlice, {DomainState} from "../../slices/DomainSlice.ts";
import {RootState} from "../../slices/Store.ts";
import {useEffect} from "react";
import Content from "../../models/value_objects/contracts/Content.ts";
import DocumentTypeService from "../../services/DocumentTypeService.ts";
import DocumentService from "../../services/DocumentService.ts";
import FileDocumentPropertyResponse
    from "../../models/value_objects/contracts/response/managements/FileDocumentPropertyResponse.ts";

export default function SelectModalComponent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const documentService = new DocumentService();
    const documentTypeService = new DocumentTypeService();
    const fileDocumentService = new FileDocumentService();
    const textDocumentService = new TextDocumentService();
    const webDocumentService = new WebDocumentService();

    const domainState: DomainState = useSelector((state: RootState) => state.domain);
    const authenticationState: AuthenticationState = useSelector((state: RootState) => state.authentication);
    const {
        account
    } = authenticationState;
    const {
        accountDocuments,
        documentTypes
    } = domainState.documentDomain;

    const {
        document,
        documentType,
        fileDocument,
        textDocument,
        webDocument
    } = domainState.currentDomain;

    const {
        name,
        isShow
    } = domainState.modalDomain;

    const handleOnHide = () => {
        dispatch(domainSlice.actions.setModalDomain({
            isShow: !isShow,
            name: "select"
        }))
    }

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

    const handleClickSelect = (document: Document) => {
        fileDocumentService.readOnePropertyById({
            id: document.id
        }).then((response) => {
            const content: Content<FileDocumentPropertyResponse> = response.data;
            dispatch(domainSlice.actions.setCurrentDomain({
                document: document,
                fileDocumentProperty: content.data
            }))
            alert("Document selected.")
            alert(content.data)
        }).catch((error) => {
            console.log(error)
        })
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


    return (
        <Modal
            size={"xl"}
            show={isShow}
            onHide={handleOnHide}
        >
            <ModalHeader closeButton>
                <Modal.Title>Select Document</Modal.Title>
            </ModalHeader>
            <ModalBody>
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
                                        <div className="d-flex flex-row">
                                            <button
                                                className="btn btn-info me-3"
                                                onClick={() => handleClickDetail(document)}
                                            >
                                                Detail
                                            </button>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleClickSelect(document)}
                                            >
                                                Select
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </ModalBody>
        </Modal>
    )
}