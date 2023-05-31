import {Modal, ModalBody, ModalFooter, ModalHeader} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import DocumentService from "../../../services/DocumentService.ts";
import DocumentTypeService from "../../../services/DocumentTypeService.ts";
import domainSlice, {DomainState} from "../../../slices/DomainSlice.ts";
import {RootState} from "../../../slices/Store.ts";
import {AuthenticationState} from "../../../slices/AuthenticationSlice.ts";
import {useFormik} from "formik";
import Content from "../../../models/value_objects/contracts/Content.ts";
import Document from "../../../models/entities/Document.ts";
import {useEffect} from "react";
import FileDocumentService from "../../../services/FileDocumentService.ts";
import FileDocument from "../../../models/entities/FileDocument.ts";

export default function DetailModalComponent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const documentService = new DocumentService();
    const fileDocumentService = new FileDocumentService();
    const documentTypeService = new DocumentTypeService();

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
            isShow: false
        }))
    }

    useEffect(() => {
        if (documentType?.name == "file") {
            fileDocumentService.readOneById({
                id: document?.id
            }).then((response) => {
                const content: Content<FileDocument> = response.data;
                dispatch(domainSlice.actions.setCurrentDomain({
                    fileDocument: content.data
                }))
                alert(JSON.stringify(content.data))
            }).catch((error) => {
                console.log(error)
            })
        }
    }, [])

    const formik = useFormik({
        initialValues: {
            id: document?.id,
            name: document?.name,
            description: document?.description,
            documentTypeId: documentType?.id,
            fileName: fileDocument?.fileName,
            fileExtension: fileDocument?.fileExtension,
            fileBytes: fileDocument?.fileBytes,
            textContent: "",
            webUrl: ""
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            documentService.patchOneById({
                id: values.id,
                body: {
                    name: values.name,
                    description: values.description,
                    documentTypeId: values.documentTypeId,
                    accountId: account?.id
                }
            }).then((response) => {
                const content: Content<Document> = response.data;
                dispatch(domainSlice.actions.setCurrentDomain({
                    document: content.data
                }))
                dispatch(domainSlice.actions.setDocumentDomain({
                    accountDocuments: accountDocuments?.map((accountDocument) => {
                        if (accountDocument.id === content.data.id) {
                            return content.data
                        }
                        return accountDocument
                    })
                }))
                alert("Patch succeed.")
            }).catch((error) => {
                console.log(error)
            })
        }
    })
    return (
        <Modal
            show={isShow}
            onHide={handleOnHide}
        >
            <ModalHeader>
                <Modal.Title>Detail</Modal.Title>
            </ModalHeader>
            <ModalBody>
                <form onSubmit={formik.handleSubmit}>
                    <fieldset className="mb-2">
                        <label className="form-label" htmlFor="id">ID:</label>
                        <input
                            className="form-control"
                            type="text"
                            name="id"
                            id="id"
                            onChange={formik.handleChange}
                            value={formik.values.id}
                        />
                    </fieldset>
                    <fieldset className="mb-2">
                        <label className="form-label" htmlFor="name">Name:</label>
                        <input
                            className="form-control"
                            type="text"
                            name="name"
                            id="name"
                            onChange={formik.handleChange}
                            value={formik.values.name}
                        />
                    </fieldset>
                    <fieldset className="mb-2">
                        <label className="form-label" htmlFor="description">Description:</label>
                        <input
                            className="form-control"
                            type="text"
                            name="description"
                            id="description"
                            onChange={formik.handleChange}
                            value={formik.values.description}
                        />
                    </fieldset>
                    <fieldset className="mb-2">
                        <label className="form-label" htmlFor="document-type">Type:</label>
                        <select
                            className="form-control"
                            name="document-type"
                            id="document-type"
                            onChange={formik.handleChange}
                            value={formik.values.documentTypeId}
                        >
                            {
                                documentTypes?.map((documentType) => {
                                        return (
                                            <option
                                                key={documentType.id}
                                                value={documentType.id}
                                            >
                                                {documentType.name}
                                            </option>
                                        )
                                    }
                                )
                            }
                        </select>
                    </fieldset>
                </form>
                {
                    {
                        "file":
                            <>
                                <fieldset className="mb-2">
                                    <label className="form-label" htmlFor="file-name">File Name:</label>
                                    <input
                                        className="form-control"
                                        type="file-name"
                                        name="file-name"
                                        id="file-name"
                                        onChange={formik.handleChange}
                                        value={formik.values.fileName}
                                    />
                                </fieldset>
                                <fieldset className="mb-2">
                                    <label className="form-label" htmlFor="file-extension">File Extension:</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="file-extension"
                                        id="file-extension"
                                        onChange={formik.handleChange}
                                        value={formik.values.fileExtension}
                                    />
                                </fieldset>
                                <fieldset className="mb-2">
                                    <label className="form-label" htmlFor="file-bytes">File Bytes:</label>
                                    <input
                                        className="form-control"
                                        type="file"
                                        name="file-bytes"
                                        id="file-bytes"
                                        onChange={formik.handleChange}
                                        value={formik.values.fileBytes}
                                    />
                                </fieldset>
                            </>
                        ,
                        "default": undefined
                    }[documentType?.name || "default"]
                }
            </ModalBody>
            <ModalFooter>
                <button onClick={formik.submitForm} className="btn btn-primary">Patch</button>
            </ModalFooter>
        </Modal>
    )
}