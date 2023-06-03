import {Modal, ModalBody, ModalHeader} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import Document from "../../models/entities/Document.ts";
import DocumentType from "../../models/entities/DocumentType.ts";
import FileDocumentService from "../../services/FileDocumentService.ts";
import TextDocumentService from "../../services/TextDocumentService.ts";
import WebDocumentService from "../../services/WebDocumentService.ts";
import {AuthenticationState} from "../../slices/AuthenticationSlice.ts";
import domainSlice, {DomainState, getDocumentTableRows} from "../../slices/DomainSlice.ts";
import {RootState} from "../../slices/Store.ts";
import {useEffect} from "react";
import Content from "../../models/value_objects/contracts/Content.ts";
import DocumentTypeService from "../../services/DocumentTypeService.ts";
import DocumentService from "../../services/DocumentService.ts";
import FileDocumentPropertyResponse
    from "../../models/value_objects/contracts/response/managements/FileDocumentPropertyResponse.ts";
import DataTable, {TableColumn} from "react-data-table-component";
import {useFormik} from "formik";

interface DocumentTableRow {
    id: string | undefined,
    name: string | undefined,
    description: string | undefined,
    documentTypeName: string | undefined,
    documentTypeId: string | undefined,
    accountId: string | undefined,
}

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
        webDocument,
        documentTableRows,
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
        fetchData();
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
                    documentTypes: documentTypesContent.data,
                }))
                dispatch(domainSlice.actions.setCurrentDomain({
                    documentTableRows: getDocumentTableRows(accountDocumentsContent.data || [], documentTypesContent.data || [])
                }))
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleClickSelect = (row: DocumentTableRow) => {
        const documentType = documentTypes?.find((documentType) => {
            return documentType.id === row.documentTypeId
        })

        if (documentType?.name === "file") {
            fileDocumentService.readOnePropertyById({
                id: row.id
            }).then((response) => {
                const content: Content<FileDocumentPropertyResponse> = response.data;
                dispatch(domainSlice.actions.setCurrentDomain({
                    document: row,
                    documentType: documentType,
                    fileDocumentProperty: content.data
                }))
                alert("Document selected.")
            }).catch((error) => {
                console.log(error)
            })
        } else if (documentType?.name === "text") {
            dispatch(domainSlice.actions.setCurrentDomain({
                document: row,
                documentType: documentType,
            }))
            alert("Document selected.")
        } else if (documentType?.name === "web") {
            dispatch(domainSlice.actions.setCurrentDomain({
                document: row,
                documentType: documentType,
            }))
            alert("Document selected.")
        } else {
            throw new Error("Document type is not supported.")
        }
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


    const columns: TableColumn<DocumentTableRow>[] = [
        {
            name: "ID",
            width: "15%",
            selector: (row: DocumentTableRow) => row.id || "",
            sortable: true,
        },
        {
            name: "Name",
            width: "15%",
            selector: (row: DocumentTableRow) => row.name || "",
            sortable: true,
        },
        {
            name: "Description",
            width: "15%",
            selector: (row: DocumentTableRow) => row.description || "",
            sortable: true,
        },
        {
            name: "Document Type Name",
            width: "20%",
            selector: (row: DocumentTableRow) => row.documentTypeName || "",
            sortable: true,
        },
        {
            name: "Actions",
            width: "20%",
            cell: (row: DocumentTableRow) =>
                <>
                    <button
                        id={row.id}
                        className="btn btn-info me-3"
                        onClick={() => handleClickDetail(row)}
                    >
                        Detail
                    </button>
                    <button
                        id={row.id}
                        className="btn btn-primary"
                        onClick={() => handleClickSelect(row)}
                    >
                        Select
                    </button>
                </>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];

    const formik = useFormik({
        initialValues: {
            search: "",
        },
        onSubmit: (values) => {
            dispatch(domainSlice.actions.setCurrentDomain({
                documentTableRows: getDocumentTableRows(accountDocuments || [], documentTypes || []).filter((documentTableRow) => {
                    return JSON.stringify(documentTableRow).toLowerCase().includes(values.search.toLowerCase())
                })
            }))
        }
    })


    return (
        <Modal
            size={"xl"}
            show={isShow}
            onHide={handleOnHide}
        >
            <ModalHeader closeButton>
                <Modal.Title>Select Document</Modal.Title>
            </ModalHeader>
            <ModalBody className="d-flex flex-column justify-content-center align-items-center">
                <input
                    type="text"
                    className="form-control w-50 mb-2"
                    placeholder="Search here.."
                    name="search"
                    onChange={(event) => {
                        formik.handleChange(event)
                        formik.handleSubmit()
                    }}
                />

                <DataTable
                    pagination={true}
                    columns={columns}
                    data={documentTableRows}
                />
            </ModalBody>
        </Modal>
    )
}