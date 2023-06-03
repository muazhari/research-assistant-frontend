import DocumentService from "../../services/DocumentService.ts";
import DocumentTypeService from "../../services/DocumentTypeService.ts";
import domainSlice, {DomainState} from "../../slices/DomainSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../slices/Store.ts";
import {AuthenticationState} from "../../slices/AuthenticationSlice.ts";
import Content from "../../models/value_objects/contracts/Content.ts";

import Document from "../../models/entities/Document.ts";
import DocumentType from "../../models/entities/DocumentType.ts";
import {useNavigate} from "react-router-dom";
import DetailModalComponent from "../../components/managements/documents/DetailModalComponent.tsx";
import InsertModalComponent from "../../components/managements/documents/InsertModalComponent.tsx";
import {useEffect, useState} from "react";
import DataTable, {TableColumn} from "react-data-table-component";
import {useFormik} from "formik";


interface DataRow {
    id: string | undefined,
    name: string | undefined,
    description: string | undefined,
    documentTypeName: string | undefined,
    documentTypeId: string | undefined,
    accountId: string | undefined,
}

export default function DocumentManagementPage() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const documentService = new DocumentService();
    const documentTypeService = new DocumentTypeService();

    const domainState: DomainState = useSelector((state: RootState) => state.domain);
    const authenticationState: AuthenticationState = useSelector((state: RootState) => state.authentication);
    const {account} = authenticationState;
    const {
        accountDocuments,
        documentTypes
    } = domainState.documentDomain;
    const {
        name,
        isShow
    } = domainState.modalDomain;


    const [data, setData] = useState<DataRow[] | undefined>();

    const getTableData = (accountDocuments: Document[]) => {
        return accountDocuments.map((document) => {
            return {
                id: document.id,
                name: document.name,
                description: document.description,
                documentTypeId: document.documentTypeId,
                accountId: document.accountId,
                documentTypeName: documentTypes?.find((documentType) => {
                    return documentType.id === document.documentTypeId
                })?.name
            }
        })
    }
    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = () => {
        Promise.all([
            documentService
                .readAllByAccountId({
                    accountId: account?.id
                }),
            documentTypeService
                .readAll()
        ])
            .then((response) => {
                const accountDocumentsContent: Content<Document[]> = response[0].data;
                const documentTypesContent: Content<DocumentType[]> = response[1].data;
                dispatch(domainSlice.actions.setDocumentDomain({
                    accountDocuments: accountDocumentsContent.data,
                    documentTypes: documentTypesContent.data
                }))
                setData(getTableData(accountDocumentsContent.data || []))
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleClickDetail = (row: DataRow) => {
        dispatch(domainSlice.actions.setModalDomain({
            name: "detail",
            isShow: true,
        }))
        dispatch(domainSlice.actions.setCurrentDomain({
            document: {
                id: row.id,
                name: row.name,
                description: row.description,
                documentTypeId: row.documentTypeId,
                accountId: row.accountId,
            },
            documentType: documentTypes?.find((documentType) => {
                return documentType.id === row.documentTypeId
            })
        }))
    }

    const handleClickDelete = (row: DataRow) => {
        documentService
            .deleteOneById({
                id: row.id
            })
            .then((response) => {
                const content: Content<Document> = response.data;
                dispatch(domainSlice.actions.setDocumentDomain({
                    accountDocuments: accountDocuments?.filter((document) => {
                        return document.id !== content.data?.id
                    })
                }))
                alert(content.message)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleClickInsert = () => {
        dispatch(domainSlice.actions.setModalDomain({
            name: "insert",
            isShow: true,
        }))
    }


    const columns: TableColumn<DataRow>[] = [
        {
            name: "ID",
            selector: (row: DataRow) => row.id!,
            sortable: true,
        },
        {
            name: "Name",
            selector: (row: DataRow) => row.name!,
            sortable: true,
        },
        {
            name: "Description",
            selector: (row: DataRow) => row.description!,
            sortable: true,
        },
        {
            name: "Document Type Name",
            selector: (row: DataRow) => row.documentTypeName!,
            sortable: true,
        },
        {
            name: "Actions",
            width: "20%",
            cell: (row: DataRow) =>
                <>
                    <button
                        id={row.id}
                        className="btn btn-info mx-3"
                        onClick={() => handleClickDetail(row)}
                    >
                        Detail
                    </button>
                    <button
                        id={row.id}
                        className="btn btn-danger"
                        onClick={() => handleClickDelete(row)}
                    >
                        Delete
                    </button>
                </>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];

    const formik = useFormik({
        initialValues: {
            search: "",
        },
        onSubmit: (values) => {
            setData(getTableData(accountDocuments || [])?.filter((document) => {
                return JSON.stringify(document).includes(values.search)
            }))
        }
    })

    return (
        <div className="d-flex flex-column justify-content-center align-items-center p-5">
            {name === "detail" && <DetailModalComponent/>}
            {name === "insert" && <InsertModalComponent/>}
            <h1 className="align-item-start mb-5">Document Management Page</h1>
            <div className="d-flex justify-content-end w-100">
                <button className="btn btn-primary align-items-end h-50 me-5" onClick={handleClickInsert}>Insert
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
                data={data || []}
            />
        </div>
    )
}