import {Modal, ModalBody, ModalFooter, ModalHeader} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import DocumentService from "../../../services/DocumentService.ts";
import DocumentTypeService from "../../../services/DocumentTypeService.ts";
import domainSlice, {DomainState} from "../../../slices/DomainSlice.ts";
import {RootState} from "../../../slices/Store.ts";
import {AuthenticationState} from "../../../slices/AuthenticationSlice.ts";
import {useFormik} from "formik";
import Content from "../../../models/value_objects/contracts/Content.ts";
import {useEffect} from "react";
import FileDocumentService from "../../../services/FileDocumentService.ts";
import FileDocument from "../../../models/entities/FileDocument.ts";
import WebDocument from "../../../models/entities/WebDocument.ts";
import TextDocument from "../../../models/entities/TextDocument.ts";
import TextDocumentService from "../../../services/TextDocumentService.ts";
import WebDocumentService from "../../../services/WebDocumentService.ts";

export default function DetailModalComponent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

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
        if (["/features/passage-search", "/features/long-form-qa"].includes(location.pathname)) {
            dispatch(domainSlice.actions.setModalDomain({
                name: "select"
            }))
        } else {
            dispatch(domainSlice.actions.setModalDomain({
                isShow: !isShow
            }))
        }
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
            }).catch((error) => {
                console.log(error)
            })
        } else if (documentType?.name == "text") {
            textDocumentService.readOneById({
                id: document?.id
            }).then((response) => {
                const content: Content<TextDocument> = response.data;
                dispatch(domainSlice.actions.setCurrentDomain({
                    textDocument: content.data
                }))
            }).catch((error) => {
                console.log(error)
            })
        } else if (documentType?.name == "web") {
            webDocumentService.readOneById({
                id: document?.id
            }).then((response) => {
                const content: Content<WebDocument> = response.data;
                dispatch(domainSlice.actions.setCurrentDomain({
                    webDocument: content.data
                }))
            }).catch((error) => {
                console.log(error)
            })
        } else {
            alert("Document type is not supported")
        }
    }, [documentType])

    const formik = useFormik({
        initialValues: {
            id: document?.id,
            name: document?.name,
            description: document?.description,
            documentTypeId: documentType?.id,
            fileName: fileDocument?.fileName,
            fileExtension: fileDocument?.fileExtension,
            fileBytes: "",
            textContent: textDocument?.textContent,
            webUrl: webDocument?.webUrl
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            if (documentType?.name == "file") {
                fileDocumentService.patchOneById({
                    id: document?.id,
                    body: {
                        name: values.name,
                        description: values.description,
                        documentTypeId: values.documentTypeId,
                        accountId: account?.id,
                        fileName: values.fileName,
                        fileExtension: values.fileExtension,
                        fileBytes: values.fileBytes
                    }
                }).then((response) => {
                    const content: Content<FileDocument> = response.data;
                    dispatch(domainSlice.actions.setCurrentDomain({
                        document: content.data,
                        fileDocument: content.data
                    }))
                    dispatch(domainSlice.actions.setDocumentDomain({
                        accountDocuments: accountDocuments?.map((accountDocument) => {
                            if (accountDocument.id === content.data?.id) {
                                return content.data
                            }
                            return accountDocument
                        })
                    }))
                    alert(content.message)
                }).catch((error) => {
                    console.log(error)
                })
            } else if (documentType?.name == "text") {
                textDocumentService.patchOneById({
                    id: document?.id,
                    body: {
                        name: values.name,
                        description: values.description,
                        documentTypeId: values.documentTypeId,
                        accountId: account?.id,
                        textContent: values.textContent
                    }
                }).then((response) => {
                    const content: Content<TextDocument> = response.data;
                    dispatch(domainSlice.actions.setCurrentDomain({
                        document: content.data,
                        textDocument: content.data
                    }))
                    dispatch(domainSlice.actions.setDocumentDomain({
                        accountDocuments: accountDocuments?.map((accountDocument) => {
                            if (accountDocument.id === content.data?.id) {
                                return content.data
                            }
                            return accountDocument
                        })
                    }))
                    alert(content.message)
                }).catch((error) => {
                    console.log(error)
                })
            } else if (documentType?.name == "web") {
                webDocumentService.patchOneById({
                    id: document?.id,
                    body: {
                        name: values.name,
                        description: values.description,
                        documentTypeId: values.documentTypeId,
                        accountId: account?.id,
                        webUrl: values.webUrl
                    }
                }).then((response) => {
                    const content: Content<WebDocument> = response.data;
                    dispatch(domainSlice.actions.setCurrentDomain({
                        document: content.data,
                        fileDocument: content.data
                    }))
                    dispatch(domainSlice.actions.setDocumentDomain({
                        accountDocuments: accountDocuments?.map((accountDocument) => {
                            if (accountDocument.id === content.data?.id) {
                                return content.data
                            }
                            return accountDocument
                        })
                    }))
                    alert(content.message)
                }).catch((error) => {
                    console.log(error)
                })
            } else {
                alert("Document type is not supported")
            }
        }
    })


    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                if (typeof fileReader.result === "string") {
                    resolve(fileReader.result.split(',')[1]);
                } else {
                    reject("Cannot convert file to base64.")
                }
            }
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }

    return (
        <Modal
            show={isShow}
            onHide={handleOnHide}
        >
            <ModalHeader closeButton>
                <Modal.Title>Detail</Modal.Title>
            </ModalHeader>
            <ModalBody>
                <form onSubmit={formik.handleSubmit}>
                    <fieldset className="mb-2">
                        <label className="form-label" htmlFor="id">ID:</label>
                        <input
                            disabled={true}
                            className="form-control"
                            type="text"
                            name="id"
                            id="id"
                            onBlur={formik.handleBlur}
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
                            onBlur={formik.handleBlur}
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
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.description}
                        />
                    </fieldset>
                    <fieldset className="mb-2">
                        <label className="form-label" htmlFor="document-type">Type:</label>
                        <select
                            disabled={true}
                            className="form-control"
                            name="documentTypeId"
                            id="document-type"
                            onBlur={formik.handleBlur}
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
                    {
                        {
                            "file":
                                <>
                                    <fieldset className="mb-2">
                                        <label className="form-label" htmlFor="file-name">File Name:</label>
                                        <input
                                            disabled={true}
                                            className="form-control"
                                            type="file-name"
                                            name="fileName"
                                            id="file-name"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.fileName}
                                        />
                                    </fieldset>
                                    <fieldset className="mb-2">
                                        <label className="form-label" htmlFor="file-extension">File Extension:</label>
                                        <input
                                            disabled={true}
                                            className="form-control"
                                            type="text"
                                            name="fileExtension"
                                            id="file-extension"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.fileExtension}
                                        />
                                    </fieldset>
                                    <fieldset className="mb-2">
                                        <label className="form-label" htmlFor="file-bytes">File Bytes:</label>
                                        <input
                                            className="form-control"
                                            type="file"
                                            name="fileBytes"
                                            id="file-bytes"
                                            onBlur={formik.handleBlur}
                                            onChange={async (event) => {
                                                formik.handleChange(event)
                                                const fileBytes: string = await convertToBase64(event.target.files![0])
                                                await formik.setFieldValue("fileBytes", fileBytes)
                                                const fileBase: string = event.target.files![0].name
                                                const fileName: string = fileBase.substring(0, fileBase.lastIndexOf('.'));
                                                const fileExtension: string = fileBase.substring(fileBase.lastIndexOf('.'));
                                                await formik.setFieldValue("fileName", fileName)
                                                await formik.setFieldValue("fileExtension", fileExtension)
                                            }}
                                        />
                                    </fieldset>
                                </>
                            ,
                            "text":
                                <>
                                    <fieldset className="mb-2">
                                        <label className="form-label" htmlFor="text-content">Text Content:</label>
                                        <textarea
                                            className="form-control"
                                            name="textContent"
                                            id="text-content"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.textContent}
                                        />
                                    </fieldset>
                                </>,
                            "web":
                                <>
                                    <fieldset className="mb-2">
                                        <label className="form-label" htmlFor="web-url">Web Url:</label>
                                        <textarea
                                            className="form-control"
                                            name="webUrl"
                                            id="web-url"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.webUrl}
                                        />
                                    </fieldset>
                                </>,
                            "default": undefined
                        }[documentType?.name || "default"]
                    }
                </form>
            </ModalBody>
            <ModalFooter>
                <button onClick={formik.submitForm} className="btn btn-primary">Patch</button>
            </ModalFooter>
        </Modal>
    )
}