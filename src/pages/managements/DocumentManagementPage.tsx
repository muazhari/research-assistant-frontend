import domainSlice, { type DomainState } from '../../slices/DomainSlice.ts'
import { useDispatch, useSelector } from 'react-redux'
import { type RootState } from '../../slices/StoreConfiguration.ts'
import type Content from '../../models/dtos/contracts/Content.ts'

import type Document from '../../models/daos/Document.ts'
import DetailModalComponent from '../../components/managements/documents/DetailModalComponent.tsx'
import InsertModalComponent from '../../components/managements/documents/InsertModalComponent.tsx'
import React, { useEffect } from 'react'

import DataTable, { type TableColumn } from 'react-data-table-component'
import { useFormik } from 'formik'
import processSlice, { type ProcessState } from '../../slices/ProcessSlice.ts'

import { documentService } from '../../containers/ServiceContainer.ts'

export default function DocumentManagementPage (): React.JSX.Element {
  const dispatch = useDispatch()

  const processState: ProcessState = useSelector((state: RootState) => state.process)
  const domainState: DomainState = useSelector((state: RootState) => state.domain)

  const {
    isLoading
  } = processState

  const {
    documents
  } = domainState.documentDomain!

  const {
    selectedDocument
  } = domainState.currentDomain!

  const {
    name
  } = domainState.modalDomain!

  useEffect(() => {
    fetchData()
  }, [selectedDocument])

  const [pagePosition, setPagePosition] = React.useState<number>(1)
  const [pageSize, setPageSize] = React.useState<number>(5)

  const fetchData = (): void => {
    dispatch(processSlice.actions.set({
      isLoading: true
    }))
    documentService
      .findManyWithPagination({
        pagePosition,
        pageSize
      })
      .then((response) => {
        const content: Content<Document[]> = response.data
        if (content.data!.length > 0) {
          dispatch(domainSlice.actions.setDocumentDomain({
            documents: content.data!
          }))
        }
      })
      .catch((error) => {
        console.error(error)
        const content: Content<null> = error.response.data
        alert(content.message)
      }).finally(() => {
        dispatch(processSlice.actions.set({
          isLoading: false
        }))
      })
  }

  const handleClickDetail = async (row: Document): Promise<void> => {
    dispatch(domainSlice.actions.setCurrentDomain({
      selectedDocument: row
    }))
    dispatch(domainSlice.actions.setModalDomain({
      name: 'detail',
      isShow: true,
      source: 'documentDetail'
    }))
  }

  const handleClickDelete = (row: Document): void => {
    dispatch(processSlice.actions.set({
      isLoading: true
    }))
    documentService
      .deleteOneById({
        id: row.id
      })
      .then((response) => {
        const content: Content<Document> = response.data
        fetchData()
        alert(content.message)
      })
      .catch((error) => {
        console.error(error)
        const content: Content<null> = error.response.data
        alert(content.message)
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

  const columns: Array<TableColumn<Document>> = [
    {
      name: 'ID',
      width: '10%',
      selector: (row: Document) => row.id!,
      sortable: true
    },
    {
      name: 'Name',
      width: '23%',
      selector: (row: Document) => row.name!,
      sortable: true
    },
    {
      name: 'Description',
      width: '27%',
      selector: (row: Document) => row.description!,
      sortable: true
    },
    {
      name: 'Document Type ID',
      width: '15%',
      selector: (row: Document) => row.documentTypeId!,
      sortable: true
    },
    {
      name: 'Actions',
      width: '25%',
      cell: (row: Document) =>
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

  const handleChangePage = (pagePosition: number): void => {
    if (pagePosition === Number.POSITIVE_INFINITY) {
      alert('Please select a valid page position.')
      return
    }
    dispatch(processSlice.actions.set({
      isLoading: true
    }))
    documentService
      .findManyWithPagination({
        pagePosition,
        pageSize
      })
      .then((response) => {
        const content: Content<Document[]> = response.data
        if (content.data!.length === 0) {
          alert('Current page position is exceeding available pages.')
        } else {
          dispatch(domainSlice.actions.setDocumentDomain({
            documents: content.data!
          }))
          setPagePosition(pagePosition)
        }
      })
      .catch((error) => {
        console.error(error)
        const content: Content<null> = error.response.data
        alert(content.message)
      }).finally(() => {
        dispatch(processSlice.actions.set({
          isLoading: false
        }))
      })
  }

  const handleChangeRowsPerPage = (pageSize: number): void => {
    dispatch(processSlice.actions.set({
      isLoading: true
    }))
    documentService
      .findManyWithPagination({
        pagePosition,
        pageSize
      })
      .then((response) => {
        const content: Content<Document[]> = response.data
        if (content.data!.length === 0) {
          alert('Current page position is exceeding available pages.')
        } else {
          dispatch(domainSlice.actions.setDocumentDomain({
            documents: content.data!
          }))
          setPageSize(pageSize)
        }
      })
      .catch((error) => {
        console.error(error)
        const content: Content<null> = error.response.data
        alert(content.message)
      }).finally(() => {
        dispatch(processSlice.actions.set({
          isLoading: false
        }))
      })
  }

  const formik = useFormik({
    initialValues: {
      search: ''
    },
    onSubmit: (values) => {
      dispatch(processSlice.actions.set({
        isLoading: true
      }))
      documentService
        .search({
          body: {
            id: values.search,
            name: values.search,
            description: values.search,
            documentTypeId: values.search,
            accountId: null
          },
          size: pageSize
        })
        .then((response) => {
          const content: Content<Document[]> = response.data
          dispatch(domainSlice.actions.setDocumentDomain({
            documents: content.data!
          }))
        })
        .catch((error) => {
          console.error(error)
          const content: Content<null> = error.response.data
          alert(content.message)
        })
        .finally(() => {
          dispatch(processSlice.actions.set({
            isLoading: false
          }))
        })
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
                noDataComponent={'No data found.'}
                pagination={true}
                columns={columns}
                data={documents!}
                paginationServer={true}
                paginationTotalRows={Number.POSITIVE_INFINITY}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                progressPending={isLoading}
                paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
                paginationPerPage={5}
            />
        </div>
  )
}
