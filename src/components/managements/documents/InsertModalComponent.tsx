import {Modal, ModalBody, ModalFooter, ModalHeader} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import DocumentService from "../../../services/DocumentService.ts";
import DocumentTypeService from "../../../services/DocumentTypeService.ts";
import domainSlice, {DomainState, getDocumentTableRows} from "../../../slices/DomainSlice.ts";
import {RootState} from "../../../slices/Store.ts";
import {AuthenticationState} from "../../../slices/AuthenticationSlice.ts";
import {useFormik} from "formik";
import Content from "../../../models/value_objects/contracts/Content.ts";
import FileDocumentService from "../../../services/FileDocumentService.ts";
import FileDocument from "../../../models/entities/FileDocument.ts";
import WebDocument from "../../../models/entities/WebDocument.ts";
import TextDocument from "../../../models/entities/TextDocument.ts";
import TextDocumentService from "../../../services/TextDocumentService.ts";
import WebDocumentService from "../../../services/WebDocumentService.ts";
import React from "react";
import processSlice, {ProcessState} from "../../../slices/ProcessSlice.ts";

export default function InsertModalComponent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const documentService = new DocumentService();
    const documentTypeService = new DocumentTypeService();
    const fileDocumentService = new FileDocumentService();
    const textDocumentService = new TextDocumentService();
    const webDocumentService = new WebDocumentService();

    const processState: ProcessState = useSelector((state: RootState) => state.process);
    const domainState: DomainState = useSelector((state: RootState) => state.domain);
    const authenticationState: AuthenticationState = useSelector((state: RootState) => state.authentication);

    const {
        isLoading
    } = processState;

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


    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            documentTypeId: documentTypes?.[0]?.id,
            fileName: "",
            fileExtension: "",
            fileBytes: "",
            textContent: "",
            webUrl: ""
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            dispatch(processSlice.actions.set({
                isLoading: true
            }));
            if (formikDocumentType?.name == "file") {
                fileDocumentService.createOne({
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
                    if (content.data) {
                        const newAccountDocuments = [...(accountDocuments || []), content.data!];
                        dispatch(domainSlice.actions.setCurrentDomain({
                            document: content.data,
                            fileDocument: content.data,
                            documentTableRows: getDocumentTableRows(newAccountDocuments || [], documentTypes || [])
                        }))
                        dispatch(domainSlice.actions.setDocumentDomain({
                            accountDocuments: newAccountDocuments
                        }))
                    }
                    alert(content.message)
                }).catch((error) => {
                    console.log(error)
                }).finally(() => {
                    dispatch(processSlice.actions.set({
                        isLoading: false
                    }));
                    formik.resetForm();
                    formik.setFieldValue("documentTypeId", formikDocumentType?.id)
                })
            } else if (formikDocumentType?.name == "text") {
                textDocumentService.createOne({
                    body: {
                        name: values.name,
                        description: values.description,
                        documentTypeId: values.documentTypeId,
                        accountId: account?.id,
                        textContent: values.textContent
                    }
                }).then((response) => {
                    const content: Content<TextDocument> = response.data;
                    if (content.data) {
                        const newAccountDocuments = [...(accountDocuments || []), content.data!];
                        dispatch(domainSlice.actions.setCurrentDomain({
                            document: content.data,
                            textDocument: content.data,
                            documentTableRows: getDocumentTableRows(newAccountDocuments || [], documentTypes || [])
                        }))
                        dispatch(domainSlice.actions.setDocumentDomain({
                            accountDocuments: newAccountDocuments
                        }))
                    }
                    alert(content.message)
                }).catch((error) => {
                    console.log(error)
                }).finally(() => {
                    dispatch(processSlice.actions.set({
                        isLoading: false
                    }));
                    formik.resetForm();
                    formik.setFieldValue("documentTypeId", formikDocumentType?.id)
                })
            } else if (formikDocumentType?.name == "web") {
                webDocumentService.createOne({
                    body: {
                        name: values.name,
                        description: values.description,
                        documentTypeId: values.documentTypeId,
                        accountId: account?.id,
                        webUrl: values.webUrl
                    }
                }).then((response) => {
                    const content: Content<WebDocument> = response.data;
                    if (content.data) {
                        const newAccountDocuments = [...(accountDocuments || []), content.data!];
                        dispatch(domainSlice.actions.setCurrentDomain({
                            document: content.data,
                            webDocument: content.data,
                            documentTableRows: getDocumentTableRows(newAccountDocuments || [], documentTypes || [])
                        }))
                        dispatch(domainSlice.actions.setDocumentDomain({
                            accountDocuments: newAccountDocuments
                        }))
                    }
                    alert(content.message)
                }).catch((error) => {
                    console.log(error)
                }).finally(() => {
                    dispatch(processSlice.actions.set({
                        isLoading: false
                    }));
                    formik.resetForm();
                    formik.setFieldValue("documentTypeId", formikDocumentType?.id)
                })
            } else {
                alert("Document type is not supported.")
            }
        }
    })


    const formikDocumentType = documentTypes?.find((documentType) => documentType.id === formik.values.documentTypeId);

    const handleOnHide = () => {
        dispatch(domainSlice.actions.setModalDomain({
            isShow: !isShow,
        }))
        formik.resetForm();
    }

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
                        <textarea
                            className="form-control"
                            name="description"
                            id="description"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.description}
                        />
                    </fieldset>
                    <fieldset className="mb-2">
                        <label className="form-label" htmlFor="documentTypeId">Type:</label>
                        <select
                            className="form-control"
                            name="documentTypeId"
                            id="documentTypeId"
                            onBlur={formik.handleBlur}
                            onChange={(event) => {
                                formik.handleChange(event)
                                formik.setFieldValue("fileName", "")
                                formik.setFieldValue("fileExtension", "")
                                formik.setFieldValue("fileBytes", "")
                                formik.setFieldValue("textContent", "")
                                formik.setFieldValue("webUrl", "")
                            }}
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
                                        <label className="form-label" htmlFor="fileName">File Name:</label>
                                        <input
                                            disabled={true}
                                            className="form-control"
                                            type="text"
                                            name="fileName"
                                            id="fileName"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.fileName}
                                        />
                                    </fieldset>
                                    <fieldset className="mb-2">
                                        <label className="form-label" htmlFor="fileExtension">File Extension:</label>
                                        <input
                                            disabled={true}
                                            className="form-control"
                                            type="text"
                                            name="fileExtension"
                                            id="fileExtension"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.fileExtension}
                                        />
                                    </fieldset>
                                    <fieldset className="mb-2">
                                        <label className="form-label" htmlFor="fileBytes">File Bytes:</label>
                                        <input
                                            className="form-control"
                                            type="file"
                                            name="fileBytes"
                                            id="fileBytes"
                                            onBlur={formik.handleBlur}
                                            onChange={
                                                async (event) => {
                                                    formik.handleChange(event)
                                                    const fileBytes: string = await convertToBase64(event.target.files![0])
                                                    await formik.setFieldValue("fileBytes", fileBytes)
                                                    const fileBase: string = event.target.files![0].name
                                                    const fileName: string = fileBase.substring(0, fileBase.lastIndexOf('.'));
                                                    const fileExtension: string = fileBase.substring(fileBase.lastIndexOf('.'));
                                                    await formik.setFieldValue("fileName", fileName)
                                                    await formik.setFieldValue("fileExtension", fileExtension)
                                                }
                                            }
                                        />
                                    </fieldset>
                                </>
                            ,
                            "text":
                                <>
                                    <fieldset className="mb-2">
                                        <label className="form-label" htmlFor="textContent">Text Content:</label>
                                        <textarea
                                            className="form-control"
                                            name="textContent"
                                            id="textContent"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.textContent}
                                        />
                                    </fieldset>
                                </>,
                            "web":
                                <>
                                    <fieldset className="mb-2">
                                        <label className="form-label" htmlFor="webUrl">Web Url:</label>
                                        <textarea
                                            className="form-control"
                                            name="webUrl"
                                            id="webUrl"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.webUrl}
                                        />
                                    </fieldset>
                                </>,
                            "default": undefined
                        }[formikDocumentType?.name || "default"]
                    }
                </form>
            </ModalBody>
            <ModalFooter>
                <button onClick={formik.submitForm} type="submit" className="btn btn-primary" disabled={isLoading}>
                    {
                        isLoading ?
                            <div className="spinner-border text-light" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            :
                            "Insert"
                    }
                </button>
            </ModalFooter>
        </Modal>
    )
}
