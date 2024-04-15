import DocumentService from '../../services/DocumentService.ts'
import DocumentTypeService from '../../services/DocumentTypeService.ts'
import domainSlice, { type DocumentTableRow, type DomainState, getDocumentTableRows } from '../../slices/DomainSlice.ts'
import { useDispatch, useSelector } from 'react-redux'
import { type RootState } from '../../slices/Store.ts'
import { type AuthenticationState } from '../../slices/AuthenticationSlice.ts'
import type Content from '../../models/dtos/contracts/Content.ts'

import type Document from '../../models/daos/Document.ts'
import type DocumentType from '../../models/daos/DocumentType.ts'
import DetailModalComponent from '../../components/managements/documents/DetailModalComponent.tsx'
import InsertModalComponent from '../../components/managements/documents/InsertModalComponent.tsx'
import React, { useEffect } from 'react'
import DataTable, { type TableColumn } from 'react-data-table-component'
import { useFormik } from 'formik'
import processSlice, { type ProcessState } from '../../slices/ProcessSlice.ts'

export default function DocumentManagementPage (): React.JSX.Element {
  const dispatch = useDispatch()

  const documentService = new DocumentService()
  const documentTypeService = new DocumentTypeService()

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
    accountDocuments,
    documentTypes
  } = domainState.documentDomain!

  const {

    documentTableRows
  } = domainState.currentDomain!

  const {
    name
  } = domainState.modalDomain!

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = (): void => {
    Promise.all([
      documentService
        .readAllByAccountId({
          accountId: account!.id
        }),
      documentTypeService
        .readAll()
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
        console.log(error)
      })
  }

  const handleClickDetail = (row: DocumentTableRow): void => {
    dispatch(domainSlice.actions.setModalDomain({
      name: 'detail',
      isShow: true
    }))
    dispatch(domainSlice.actions.setCurrentDomain({
      document: {
        id: row.id,
        name: row.name,
        description: row.description,
        documentTypeId: row.documentTypeId,
        accountId: row.accountId
      },
      documentType: documentTypes!.find((documentType) => {
        return documentType.id === row.documentTypeId
      })
    }))
  }

  const handleClickDelete = (row: DocumentTableRow): void => {
    dispatch(processSlice.actions.set({
      isLoading: true
    }))
    documentService
      .deleteOneById({
        id: row.id
      })
      .then((response) => {
        const content: Content<Document> = response.data
        const newAccountDocuments = accountDocuments!.filter((document) => {
          return document.id !== content.data!.id
        })
        dispatch(domainSlice.actions.setDocumentDomain({
          accountDocuments: newAccountDocuments
        }))
        dispatch(domainSlice.actions.setCurrentDomain({
          documentTableRows: getDocumentTableRows(newAccountDocuments, documentTypes!)
        }))
        alert(content.message)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        dispatch(processSlice.actions.set({
          isLoading: false
        }))
      })
  }

  const handleClickInsert = (): void => {
    dispatch(domainSlice.actions.setModalDomain({
      name: 'insert',
      isShow: true
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
                        className="btn btn-info mx-3"
                        onClick={() => { handleClickDetail(row) }}
                        disabled={isLoading}
                    >
                        {
                            isLoading!
                              ? <div className="spinner-border text-light" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                              : 'Detail'
                        }
                    </button>
                    <button
                        id={row.id}
                        className="btn btn-danger"
                        onClick={() => { handleClickDelete(row) }}
                        disabled={isLoading}
                    >
                        {
                            isLoading!
                              ? <div className="spinner-border text-light" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                              : 'Delete'
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
        <div className="d-flex flex-column justify-content-center align-items-center p-5">
            {name === 'detail' && <DetailModalComponent/>}
            {name === 'insert' && <InsertModalComponent/>}
            <h1 className="align-item-start mb-5">Document Management Page</h1>
            <div className="d-flex justify-content-end w-100">
                <button className="btn btn-primary align-items-end h-50 me-5" onClick={handleClickInsert}>
                    Insert
                </button>
            </div>

            <input
                type="text"
                className="form-control w-50 mb-5"
                placeholder="Search here.."
                name="search"
                value={formik.values.search}
                onBlur={formik.handleBlur}
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
        </div>
  )
}
