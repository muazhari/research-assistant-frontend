import { Modal, ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import domainSlice, { type DomainState } from '../../../slices/DomainSlice.ts'
import { type RootState } from '../../../slices/StoreConfiguration.ts'
import { useFormik } from 'formik'
import type Content from '../../../models/dtos/contracts/Content.ts'
import React, { useEffect } from 'react'
import type FileDocument from '../../../models/daos/FileDocument.ts'
import type WebDocument from '../../../models/daos/WebDocument.ts'
import type TextDocument from '../../../models/daos/TextDocument.ts'
import processSlice, { type ProcessState } from '../../../slices/ProcessSlice.ts'
import DocumentTypeConstant from '../../../models/dtos/constants/DocumentTypeConstant.ts'
import type Document from '../../../models/daos/Document.ts'
import { fileDocumentService, textDocumentService, webDocumentService } from '../../../containers/ServiceContainer.ts'
import { type AxiosResponse } from 'axios'

export default function DetailModalComponent (): React.JSX.Element {
  const dispatch = useDispatch()

  const processState: ProcessState = useSelector((state: RootState) => state.process)
  const domainState: DomainState = useSelector((state: RootState) => state.domain)

  const {
    isLoading
  } = processState

  const {
    selectedDocument,
    selectedDocumentDetail
  } = domainState.currentDomain!

  const {
    isShow,
    source
  } = domainState.modalDomain!

  const fetchDataDetail = (): void => {
    dispatch(processSlice.actions.set({
      isLoading: true
    }))
    let documentDetail: Promise<AxiosResponse<Content<FileDocument | TextDocument | WebDocument>>>
    if (selectedDocument!.documentTypeId! === DocumentTypeConstant.FILE) {
      documentDetail = fileDocumentService
        .findOneById({
          id: selectedDocument!.id
        })
    } else if (selectedDocument!.documentTypeId! === DocumentTypeConstant.TEXT) {
      documentDetail = textDocumentService
        .findOneById({
          id: selectedDocument!.id
        })
    } else if (selectedDocument!.documentTypeId! === DocumentTypeConstant.WEB) {
      documentDetail = webDocumentService
        .findOneById({
          id: selectedDocument!.id
        })
    } else {
      console.error('Document type is not supported.')
      return
    }
    documentDetail
      .then((response) => {
        const content: Content<FileDocument | TextDocument | WebDocument> = response.data
        dispatch(domainSlice.actions.setCurrentDomain({
          selectedDocumentDetail: content.data!
        }))
      }).catch((error) => {
        console.error(error)
        alert(JSON.stringify(error.response.data, null, 2))
      }).finally(() => {
        dispatch(processSlice.actions.set({
          isLoading: false
        }))
      })
  }

  const [initialValues, setInitialValues] = React.useState({
    id: selectedDocument!.id!,
    name: selectedDocument!.name!,
    description: selectedDocument!.description!,
    documentTypeId: selectedDocument!.documentTypeId!,
    accountId: selectedDocument!.accountId!,
    fileName: '',
    fileData: undefined,
    fileDataHash: '',
    fileMetadata: {
      fileUrl: ''
    },
    textContent: '',
    textContentHash: '',
    webUrl: '',
    webUrlHash: ''
  })

  useEffect(() => {
    setInitialValues({ ...initialValues, ...selectedDocument })
    fetchDataDetail()
  }, [selectedDocument])

  useEffect(() => {
    setInitialValues({
      ...initialValues,
      ...(selectedDocumentDetail as typeof initialValues),
      fileData: undefined
    })
  }, [selectedDocumentDetail])

  const handleOnHide = (): void => {
    if (source === 'selectDocumentId') {
      dispatch(domainSlice.actions.setModalDomain({
        name: 'select'
      }))
    } else {
      dispatch(domainSlice.actions.setModalDomain({
        isShow: false
      }))
    }
  }

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      dispatch(processSlice.actions.set({
        isLoading: true
      }))
      let documentDetail: Promise<AxiosResponse<Content<FileDocument | TextDocument | WebDocument>>>
      if (selectedDocument!.documentTypeId! === DocumentTypeConstant.FILE) {
        const {
          fileMetadata,
          ...filteredValues
        } = values as FileDocument
        documentDetail = fileDocumentService.patchOneById({
          id: selectedDocument!.id,
          body: filteredValues
        })
      } else if (selectedDocument!.documentTypeId! === DocumentTypeConstant.TEXT) {
        documentDetail = textDocumentService.patchOneById({
          id: selectedDocument!.id,
          body: values as TextDocument
        })
      } else if (selectedDocument!.documentTypeId! === DocumentTypeConstant.WEB) {
        documentDetail = webDocumentService.patchOneById({
          id: selectedDocument!.id,
          body: values as WebDocument
        })
      } else {
        console.error('Document type is not supported.')
        return
      }
      documentDetail
        .then((response) => {
          const content: Content<WebDocument> = response.data
          dispatch(domainSlice.actions.setCurrentDomain({
            selectedDocument: content.data! as Document,
            selectedDocumentDetail: content.data!
          }))
          alert(content.message)
        })
        .catch((error) => {
          console.error(error)
          alert(JSON.stringify(error.response.data, null, 2))
        })
        .finally(() => {
          dispatch(processSlice.actions.set({
            isLoading: false
          }))
        })
    }
  })

  return (
        <Modal
            show={isShow}
            onHide={handleOnHide}
        >
            <ModalHeader closeButton>
                <Modal.Title>Detail</Modal.Title>
            </ModalHeader>
            <ModalBody>
                <form>
                    <fieldset className="mb-2">
                        <label className="form-label" htmlFor="id">ID</label>
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
                        <label className="form-label" htmlFor="name">Name</label>
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
                        <label className="form-label" htmlFor="description">Description</label>
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
                        <label className="form-label" htmlFor="documentTypeId">Type ID</label>
                        <select
                            disabled={true}
                            className="form-control"
                            name="documentTypeId"
                            id="documentTypeId"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.documentTypeId}
                        >
                            {
                                DocumentTypeConstant.getValues().map((documentTypeId: string) => {
                                  return (
                                        <option
                                            key={documentTypeId}
                                            value={documentTypeId}
                                        >
                                            {documentTypeId}
                                        </option>
                                  )
                                })
                            }
                        </select>
                    </fieldset>
                    {selectedDocument!.documentTypeId === DocumentTypeConstant.FILE &&
                        <>
                            <fieldset className="mb-2">
                                <label className="form-label" htmlFor="fileName">File Name</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="fileName"
                                    id="fileName"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={(formik.values as FileDocument).fileName}
                                />
                            </fieldset>
                            <fieldset className="mb-2">
                                <label className="form-label" htmlFor="fileDataHash">File Data SHA256 Hash</label>
                                <textarea
                                    disabled={true}
                                    className="form-control"
                                    name="fileDataHash"
                                    id="fileDataHash"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={(formik.values as FileDocument).fileDataHash}
                                />
                            </fieldset>
                            <fieldset className="mb-2">
                                <label className="form-label" htmlFor="fileData">File Data</label>
                                <input
                                    className="form-control"
                                    type="file"
                                    name="fileData"
                                    id="fileData"
                                    onBlur={formik.handleBlur}
                                    onChange={(event) => {
                                      formik.handleChange(event)
                                      const fileData: File = event.target.files![0]
                                      formik.setFieldValue('fileData', fileData)
                                      formik.setFieldValue('fileName', fileData.name)
                                    }}
                                />
                            </fieldset>
                            <div className="d-flex justify-content-center align-items-center mt-3">
                                <a
                                    className="w-100"
                                    download={(formik.values as FileDocument).fileName}
                                    href={(formik.values as FileDocument).fileMetadata!.fileUrl}
                                >
                                    <button className="btn btn-warning w-100" type="button">Download</button>
                                </a>
                            </div>
                        </>
                    }
                    {selectedDocument!.documentTypeId === DocumentTypeConstant.TEXT &&
                        <>
                            <fieldset className="mb-2">
                                <label className="form-label" htmlFor="textContentHash">Text Content SHA256 Hash</label>
                                <textarea
                                    disabled={true}
                                    className="form-control"
                                    name="textContentHash"
                                    id="textContentHash"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={(formik.values as TextDocument).textContentHash}
                                />
                            </fieldset>
                            <fieldset className="mb-2">
                                <label className="form-label" htmlFor="textContent">Text Content</label>
                                <textarea
                                    className="form-control"
                                    name="textContent"
                                    id="textContent"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={(formik.values as TextDocument).textContent}
                                />
                            </fieldset>
                        </>
                    }
                    {selectedDocument!.documentTypeId === DocumentTypeConstant.WEB &&
                        <>
                            <fieldset className="mb-2">
                                <label className="form-label" htmlFor="webUrlHash">Web Url SHA256 Hash</label>
                                <textarea
                                    disabled={true}
                                    className="form-control"
                                    name="webUrlHash"
                                    id="webUrlHash"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={(formik.values as WebDocument).webUrlHash}
                                />
                            </fieldset>
                            <fieldset className="mb-2">
                                <label className="form-label" htmlFor="webUrl">Web Url</label>
                                <textarea
                                    className="form-control"
                                    name="webUrl"
                                    id="webUrl"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={(formik.values as WebDocument).webUrl}
                                />
                            </fieldset>
                        </>
                    }
                </form>
            </ModalBody>
            <ModalFooter>
                <button onClick={formik.submitForm} type="submit" className="btn btn-primary" disabled={isLoading}>
                    {
                        isLoading!
                          ? <div className="spinner-border text-light" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                          : 'Patch'
                    }
                </button>
            </ModalFooter>
        </Modal>
  )
}
