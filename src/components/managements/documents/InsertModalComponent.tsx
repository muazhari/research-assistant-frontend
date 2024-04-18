import { Modal, ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import domainSlice, { type DomainState } from '../../../slices/DomainSlice.ts'
import { type RootState } from '../../../slices/StoreConfiguration.ts'
import { type AuthenticationState } from '../../../slices/AuthenticationSlice.ts'
import { useFormik } from 'formik'
import type Content from '../../../models/dtos/contracts/Content.ts'
import type FileDocument from '../../../models/daos/FileDocument.ts'
import type WebDocument from '../../../models/daos/WebDocument.ts'
import type TextDocument from '../../../models/daos/TextDocument.ts'
import React from 'react'
import processSlice, { type ProcessState } from '../../../slices/ProcessSlice.ts'
import DocumentTypeConstant from '../../../models/dtos/constants/DocumentTypeConstant.ts'
import type Document from '../../../models/daos/Document.ts'
import { fileDocumentService, textDocumentService, webDocumentService } from '../../../containers/ServiceContainer.ts'
import { type AxiosResponse } from 'axios'

export default function InsertModalComponent (): React.JSX.Element {
  const dispatch = useDispatch()

  const processState: ProcessState = useSelector((state: RootState) => state.process)
  const domainState: DomainState = useSelector((state: RootState) => state.domain)
  const authenticationState: AuthenticationState = useSelector((state: RootState) => state.authentication)

  const {
    isLoading
  } = processState

  const {
    account
  } = authenticationState

  const {
    isShow
  } = domainState.modalDomain!

  const [initialValues, setInitialValues] = React.useState({
    name: '',
    description: '',
    documentTypeId: DocumentTypeConstant.FILE,
    accountId: account!.id,
    fileName: '',
    fileData: undefined,
    textContent: '',
    webUrl: ''
  })

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      setInitialValues(values)
      dispatch(processSlice.actions.set({
        isLoading: true
      }))
      let documentDetail: Promise<AxiosResponse<Content<FileDocument | TextDocument | WebDocument>>>
      if (values.documentTypeId === DocumentTypeConstant.FILE) {
        documentDetail = fileDocumentService
          .createOne({
            body: {
              name: values.name,
              description: values.description,
              documentTypeId: values.documentTypeId,
              accountId: values.accountId,
              fileName: values.fileName,
              fileData: values.fileData
            }
          })
      } else if (values.documentTypeId === DocumentTypeConstant.TEXT) {
        documentDetail = textDocumentService
          .createOne({
            body: {
              name: values.name,
              description: values.description,
              documentTypeId: values.documentTypeId,
              accountId: values.accountId,
              textContent: values.textContent
            }
          })
      } else if (values.documentTypeId === DocumentTypeConstant.WEB) {
        documentDetail = webDocumentService
          .createOne({
            body: {
              name: values.name,
              description: values.description,
              documentTypeId: values.documentTypeId,
              accountId: values.accountId,
              webUrl: values.webUrl
            }
          })
      } else {
        console.error('Document Type is not supported.')
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
        }).catch((error) => {
          console.error(error)
          const content: Content<null> = error.response.data
          alert(content.message)
        }).finally(async () => {
          dispatch(processSlice.actions.set({
            isLoading: false
          }))
          formik.resetForm()
        })
    }
  })

  const handleOnHide = (): void => {
    dispatch(domainSlice.actions.setModalDomain({
      isShow: false
    }))
    formik.resetForm()
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
                    { formik.values.documentTypeId === DocumentTypeConstant.FILE &&
                                <>
                                    <fieldset className="mb-2">
                                        <label className="form-label" htmlFor="fileName">File Name</label>
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
                                </>
                    }
                  {formik.values.documentTypeId === DocumentTypeConstant.TEXT &&
                      <>
                        <fieldset className="mb-2">
                          <label className="form-label" htmlFor="textContent">Text Content</label>
                          <textarea
                              className="form-control"
                              name="textContent"
                              id="textContent"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.textContent}
                          />
                        </fieldset>
                      </>
                  }
                  {formik.values.documentTypeId === DocumentTypeConstant.WEB &&
                                <>
                                    <fieldset className="mb-2">
                                        <label className="form-label" htmlFor="webUrl">Web Url</label>
                                        <textarea
                                            className="form-control"
                                            name="webUrl"
                                            id="webUrl"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.webUrl}
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
                          : 'Insert'
                    }
                </button>
            </ModalFooter>
        </Modal>
  )
}
