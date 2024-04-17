import { Modal, ModalBody, ModalHeader } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import type Document from '../../models/daos/Document.ts'
import type DocumentType from '../../models/daos/DocumentType.ts'
import FileDocumentService from '../../services/FileDocumentService.ts'
import { type AuthenticationState } from '../../slices/AuthenticationSlice.ts'
import domainSlice, { type DocumentTableRow, type DomainState, getDocumentTableRows } from '../../slices/DomainSlice.ts'
import { type RootState } from '../../slices/StoreConfiguration.ts'
import React, { useEffect } from 'react'
import type Content from '../../models/dtos/contracts/Content.ts'
import DocumentTypeService from '../../services/DocumentTypeService.ts'
import DocumentService from '../../services/DocumentService.ts'
import type FileDocumentPropertyResponse
  from '../../models/dtos/contracts/response/managements/FileDocumentPropertyResponse.ts'
import DataTable, { type TableColumn } from 'react-data-table-component'
import { useFormik } from 'formik'
import processSlice, { type ProcessState } from '../../slices/ProcessSlice.ts'

export default function SelectModalComponent (): React.JSX.Element {
  const dispatch = useDispatch()

  const documentService = new DocumentService()
  const documentTypeService = new DocumentTypeService()
  const fileDocumentService = new FileDocumentService()

  const domainState: DomainState = useSelector((state: RootState) => state.domain)
  const authenticationState: AuthenticationState = useSelector((state: RootState) => state.authentication)
  const processState: ProcessState = useSelector((state: RootState) => state.process)

  const {
    isLoading
  } = processState

  const {
    account
  } = authenticationState

  const {
    accountDocuments,
    documentTypes
  } = domainState.documentDomain!

  const {
    documentTableRows
  } = domainState.currentDomain!

  const {
    isShow
  } = domainState.modalDomain!

  const handleOnHide = (): void => {
    dispatch(domainSlice.actions.setModalDomain({
      isShow: !(isShow!)
    }))
  }

  useEffect(() => {
    fetchData()
  }, [isShow])

  const fetchData = (): void => {
    Promise.all([
      documentService
        .findManyByAccountId({
          accountId: account!.id
        }),
      documentTypeService
        .findMany()
    ])
      .then((response) => {
        const accountDocumentsContent: Content<Document[]> = response[0].data
        const documentTypesContent: Content<DocumentType[]> = response[1].data
        dispatch(domainSlice.actions.setDocumentDomain({
          accountDocuments: accountDocumentsContent.data,
          documentTypes: documentTypesContent.data
        }))
        dispatch(domainSlice.actions.setCurrentDomain({
          documentTableRows: getDocumentTableRows(accountDocumentsContent.data!, documentTypesContent.data!)
        }))
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleClickSelect = (row: DocumentTableRow): void => {
    const documentType = documentTypes!.find((documentType) => {
      return documentType.id === row.documentTypeId
    })

    if (documentType!.name === 'file') {
      dispatch(processSlice.actions.set({
        isLoading: true
      }))
      fileDocumentService.findOnePropertyById({
        id: row.id
      }).then((response) => {
        const content: Content<FileDocumentPropertyResponse> = response.data
        dispatch(domainSlice.actions.setCurrentDomain({
          document: row,
          documentType,
          fileDocumentProperty: content.data!
        }))
        handleOnHide()
        alert('Document selected.')
      }).catch((error) => {
        console.error(error)
      }).finally(() => {
        dispatch(processSlice.actions.set({
          isLoading: false
        }))
      })
    } else if (documentType!.name === 'text') {
      dispatch(domainSlice.actions.setCurrentDomain({
        document: row,
        documentType
      }))
      alert('Document selected.')
    } else if (documentType!.name === 'web') {
      dispatch(domainSlice.actions.setCurrentDomain({
        document: row,
        documentType
      }))
      alert('Document selected.')
    } else {
      throw new Error('Document type is not supported.')
    }
  }

  const handleClickDetail = (document: Document): void => {
    dispatch(domainSlice.actions.setModalDomain({
      name: 'detail',
      isShow: true
    }))
    dispatch(domainSlice.actions.setCurrentDomain({
      document,
      documentType: documentTypes!.find((documentType) => {
        return documentType.id === document.documentTypeId
      })
    }))
  }

  const columns: Array<TableColumn<DocumentTableRow>> = [
    {
      name: 'ID',
      width: '10%',
      selector: (row: DocumentTableRow) => row.id!,
      sortable: true
    },
    {
      name: 'Name',
      width: '23%',
      selector: (row: DocumentTableRow) => row.name!,
      sortable: true
    },
    {
      name: 'Description',
      width: '27%',
      selector: (row: DocumentTableRow) => row.description!,
      sortable: true
    },
    {
      name: 'Document Type Name',
      width: '15%',
      selector: (row: DocumentTableRow) => row.documentTypeName!,
      sortable: true
    },
    {
      name: 'Actions',
      width: '25%',
      cell: (row: DocumentTableRow) =>
                <>
                    <button
                        id={row.id}
                        className="btn btn-info me-3"
                        onClick={() => { handleClickDetail(row) }}
                    >{
                        isLoading!
                          ? <div className="spinner-border text-light" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                          : 'Detail'
                    }
                    </button>
                    <button
                        id={row.id}
                        className="btn btn-primary"
                        onClick={() => { handleClickSelect(row) }}
                    >{
                        isLoading!
                          ? <div className="spinner-border text-light" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                          : 'Select'
                    }
                    </button>
                </>
    }
  ]

  const formik = useFormik({
    initialValues: {
      search: ''
    },
    onSubmit: (values) => {
      dispatch(domainSlice.actions.setCurrentDomain({
        documentTableRows: getDocumentTableRows(accountDocuments!, documentTypes!).filter((documentTableRow) => {
          return JSON.stringify(documentTableRow).toLowerCase().includes(values.search.toLowerCase())
        })
      }))
    }
  })

  return (
        <Modal
            size={'xl'}
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
                    data={documentTableRows!}
                />
            </ModalBody>
        </Modal>
  )
}
