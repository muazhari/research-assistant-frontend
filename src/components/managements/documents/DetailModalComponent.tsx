import { Modal, ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import domainSlice, { type DomainState } from '../../../slices/DomainSlice.ts'
import { type RootState } from '../../../slices/Store.ts'
import { useFormik } from 'formik'
import type Content from '../../../models/dtos/contracts/Content.ts'
import React, { useEffect } from 'react'
import FileDocumentService from '../../../services/FileDocumentService.ts'
import type FileDocument from '../../../models/daos/FileDocument.ts'
import type WebDocument from '../../../models/daos/WebDocument.ts'
import type TextDocument from '../../../models/daos/TextDocument.ts'
import TextDocumentService from '../../../services/TextDocumentService.ts'
import WebDocumentService from '../../../services/WebDocumentService.ts'
import processSlice, { type ProcessState } from '../../../slices/ProcessSlice.ts'
import DocumentTypeConstant from '../../../models/dtos/constants/DocumentTypeConstant.ts'
import type Document from '../../../models/daos/Document.ts'

export default function DetailModalComponent (): React.JSX.Element {
  const dispatch = useDispatch()
  const location = useLocation()

  const fileDocumentService = new FileDocumentService()
  const textDocumentService = new TextDocumentService()
  const webDocumentService = new WebDocumentService()

  const processState: ProcessState = useSelector((state: RootState) => state.process)
  const domainState: DomainState = useSelector((state: RootState) => state.domain)

  const {
    isLoading
  } = processState

  const {
    documents
  } = domainState.documentDomain!

  const {
    document,
    fileDocument,
    textDocument,
    webDocument
  } = domainState.currentDomain!

  const {
    isShow
  } = domainState.modalDomain!

  const handleOnHide = (): void => {
    if (['/features/passage-search', '/features/long-form-qa'].includes(location.pathname)) {
      dispatch(domainSlice.actions.setModalDomain({
        name: 'select'
      }))
    } else {
      dispatch(domainSlice.actions.setModalDomain({
        isShow: !(isShow!)
      }))
    }
  }

  useEffect(() => {
    fetchData()
  }, [document])

  const fetchData = (): void => {
    dispatch(processSlice.actions.set({
      isLoading: true
    }))
    if (document!.documentTypeId! === DocumentTypeConstant.FILE) {
      fileDocumentService.findOneById({
        id: document!.id
      }).then((response) => {
        const content: Content<FileDocument> = response.data
        dispatch(domainSlice.actions.setCurrentDomain({
          fileDocument: content.data!
        }))
      }).catch((error) => {
        console.error(error)
        const content: Content<null> = error.response.data
        alert(content.message)
      }).finally(() => {
        dispatch(processSlice.actions.set({
          isLoading: false
        }))
      })
    } else if (document!.documentTypeId! === DocumentTypeConstant.TEXT) {
      textDocumentService.findOneById({
        id: document!.id
      }).then((response) => {
        const content: Content<TextDocument> = response.data
        dispatch(domainSlice.actions.setCurrentDomain({
          textDocument: content.data!
        }))
      }).catch((error) => {
        console.error(error)
        const content: Content<null> = error.response.data
        alert(content.message)
      }).finally(() => {
        dispatch(processSlice.actions.set({
          isLoading: false
        }))
      })
    } else if (document!.documentTypeId! === DocumentTypeConstant.WEB) {
      webDocumentService.findOneById({
        id: document!.id
      }).then((response) => {
        const content: Content<WebDocument> = response.data
        dispatch(domainSlice.actions.setCurrentDomain({
          webDocument: content.data!
        }))
      }).catch((error) => {
        console.error(error)
        const content: Content<null> = error.response.data
        alert(content.message)
      }).finally(() => {
        dispatch(processSlice.actions.set({
          isLoading: false
        }))
      })
    } else {
      console.error('Document type is not supported.')
    }
  }

  const getInitialValues = (): FileDocument | TextDocument | WebDocument => {
    if (document!.documentTypeId! === DocumentTypeConstant.FILE) {
      return fileDocument!
    } else if (document!.documentTypeId! === DocumentTypeConstant.TEXT) {
      return textDocument!
    } else if (document!.documentTypeId! === DocumentTypeConstant.WEB) {
      return webDocument!
    } else {
      console.error('Document type is not supported.')
      return {}
    }
  }

  const formik = useFormik({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    onSubmit: (values: FileDocument | TextDocument | WebDocument) => {
      dispatch(processSlice.actions.set({
        isLoading: true
      }))
      if (document!.documentTypeId! === DocumentTypeConstant.FILE) {
        const { fileMetadata, ...filteredValues } = values as FileDocument
        fileDocumentService.patchOneById({
          id: document!.id,
          body: filteredValues
        }).then((response) => {
          const content: Content<FileDocument> = response.data
          const newDocuments: Document[] = documents!.map((document: Document): Document => {
            if (document.id === content.data!.id) {
              return content.data! as Document
            }
            return document
          })
          dispatch(domainSlice.actions.setCurrentDomain({
            document: content.data! as Document,
            fileDocument: content.data!
          }))
          dispatch(domainSlice.actions.setDocumentDomain({
            documents: newDocuments
          }))
          alert(content.message)
        }).catch((error) => {
          console.error(error)
          const content: Content<null> = error.response.data
          alert(content.message)
        }).finally(() => {
          dispatch(processSlice.actions.set({
            isLoading: false
          }))
        })
      } else if (document!.documentTypeId! === DocumentTypeConstant.TEXT) {
        textDocumentService.patchOneById({
          id: document!.id,
          body: values as TextDocument
        }).then((response) => {
          const content: Content<TextDocument> = response.data
          const newDocuments = documents!.map((document: Document): Document => {
            if (document.id === content.data!.id) {
              return content.data! as Document
            }
            return document
          })
          dispatch(domainSlice.actions.setCurrentDomain({
            document: content.data! as Document,
            textDocument: content.data!
          }))
          dispatch(domainSlice.actions.setDocumentDomain({
            documents: newDocuments
          }))
          alert(content.message)
        }).catch((error) => {
          console.error(error)
          const content: Content<null> = error.response.data
          alert(content.message)
        }).finally(() => {
          dispatch(processSlice.actions.set({
            isLoading: false
          }))
        })
      } else if (document!.documentTypeId! === DocumentTypeConstant.WEB) {
        webDocumentService.patchOneById({
          id: document!.id,
          body: values as WebDocument
        }).then((response) => {
          const content: Content<WebDocument> = response.data
          const newDocuments: Document[] = documents!.map((document: Document): Document => {
            if (document.id === content.data!.id) {
              return content.data! as Document
            }
            return document
          })
          dispatch(domainSlice.actions.setCurrentDomain({
            document: content.data! as Document,
            webDocument: content.data!
          }))
          dispatch(domainSlice.actions.setDocumentDomain({
            documents: newDocuments
          }))
          alert(content.message)
        }).catch((error) => {
          console.error(error)
          const content: Content<null> = error.response.data
          alert(content.message)
        }).finally(() => {
          dispatch(processSlice.actions.set({
            isLoading: false
          }))
        })
      } else {
        console.error('Document type is not supported.')
      }
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
                <form onSubmit={formik.handleSubmit}>
                    <fieldset className="mb-2">
                        <label className="form-label" htmlFor="id">ID:</label>
                        <input
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
                                DocumentTypeConstant.getValues().map((documentTypeId: string) => {
                                  return (
                                            <option
                                                key={documentTypeId}
                                                value={documentTypeId}
                                            >
                                                {documentTypeId.charAt(0).toUpperCase() + documentTypeId.slice(1)}
                                            </option>
                                  )
                                })
                            }
                        </select>
                    </fieldset>
                    { document!.documentTypeId === DocumentTypeConstant.FILE &&
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
                                            value={(formik.values as FileDocument).fileName}
                                        />
                                    </fieldset>
                                    <fieldset className="mb-2">
                                        <label className="form-label" htmlFor="file-data">File Data:</label>
                                        <input
                                            className="form-control"
                                            type="file"
                                            name="fileData"
                                            id="file-data"
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
                                            download={`${(formik.values as FileDocument).fileName}`}
                                            href={(formik.values as FileDocument).fileMetadata!.fileUrl}
                                        >
                                            <button className="btn btn-success" type="button">Download</button>
                                        </a>
                                    </div>
                                </>
                            }
                  { document!.documentTypeId === DocumentTypeConstant.TEXT &&
                                <>
                                    <fieldset className="mb-2">
                                        <label className="form-label" htmlFor="text-content">Text Content:</label>
                                        <textarea
                                            className="form-control"
                                            name="textContent"
                                            id="text-content"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={(formik.values as TextDocument).textContent}
                                        />
                                    </fieldset>
                                </>
                  }
                  { document!.documentTypeId === DocumentTypeConstant.WEB &&
                                <>
                                    <fieldset className="mb-2">
                                        <label className="form-label" htmlFor="web-url">Web Url:</label>
                                        <textarea
                                            className="form-control"
                                            name="webUrl"
                                            id="web-url"
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
