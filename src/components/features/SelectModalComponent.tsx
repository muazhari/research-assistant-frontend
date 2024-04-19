import { Modal, ModalBody, ModalHeader } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import type Document from '../../models/daos/Document.ts'
import domainSlice, { type DomainState } from '../../slices/DomainSlice.ts'
import { type RootState } from '../../slices/StoreConfiguration.ts'
import React, { useEffect } from 'react'
import type Content from '../../models/dtos/contracts/Content.ts'
import DataTable, { type TableColumn } from 'react-data-table-component'
import { useFormik } from 'formik'
import processSlice, { type ProcessState } from '../../slices/ProcessSlice.ts'
import { documentService } from '../../containers/ServiceContainer.ts'

export default function SelectModalComponent (): React.JSX.Element {
  const dispatch = useDispatch()

  const domainState: DomainState = useSelector((state: RootState) => state.domain)
  const processState: ProcessState = useSelector((state: RootState) => state.process)

  const {
    isLoading
  } = processState

  const {
    documents
  } = domainState.documentDomain!

  const {
    selectedDocuments
  } = domainState.currentDomain!

  const {
    isShow
  } = domainState.modalDomain!

  const handleOnHide = (): void => {
    dispatch(domainSlice.actions.setModalDomain({
      isShow: false
    }))
  }

  useEffect(() => {
    fetchData()
  }, [isShow])

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
        setPageSize(pageSize)
      })
      .catch((error) => {
        console.error(error)
        alert(JSON.stringify(error.response.data, null, 2))
      }).finally(() => {
        dispatch(processSlice.actions.set({
          isLoading: false
        }))
      })
  }

  const handleClickSelect = (row: Document): void => {
    if (selectedDocuments!.find((document: Document) => document.id === row.id) !== undefined) {
      dispatch(domainSlice.actions.setCurrentDomain({
        selectedDocuments: selectedDocuments!.filter((document: Document) => document.id !== row.id)
      }))
    } else {
      dispatch(domainSlice.actions.setCurrentDomain({
        selectedDocuments: [...selectedDocuments!, row]
      }))
    }
  }

  const handleClickDetail = (row: Document): void => {
    dispatch(domainSlice.actions.setCurrentDomain({
      selectedDocument: row
    }))
    dispatch(domainSlice.actions.setModalDomain({
      name: 'detail',
      isShow: true
    }))
  }

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
        alert(JSON.stringify(error.response.data, null, 2))
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
        alert(JSON.stringify(error.response.data, null, 2))
      }).finally(() => {
        dispatch(processSlice.actions.set({
          isLoading: false
        }))
      })
  }

  const columns: Array<TableColumn<Document>> = [
    {
      name: 'ID',
      width: '8%',
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
      width: '12%',
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
                          : selectedDocuments!.find((document: Document) => document.id === row.id) !== undefined
                            ? 'Unselect'
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
                    noDataComponent={'No data found.'}
                    pagination={true}
                    columns={columns}
                    data={documents!}
                    paginationServer={true}
                    paginationTotalRows={Number.POSITIVE_INFINITY}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
                    paginationPerPage={5}
                />
            </ModalBody>
        </Modal>
  )
}
