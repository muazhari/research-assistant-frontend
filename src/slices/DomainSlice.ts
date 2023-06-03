import {createSlice} from '@reduxjs/toolkit';
import Account from "../models/entities/Account.ts";
import Document from "../models/entities/Document.ts";
import DocumentType from "../models/entities/DocumentType.ts";
import FileDocument from "../models/entities/FileDocument.ts";
import TextDocument from "../models/entities/TextDocument.ts";
import WebDocument from "../models/entities/WebDocument.ts";
import FileDocumentPropertyResponse
    from "../models/value_objects/contracts/response/managements/FileDocumentPropertyResponse.ts";
import QaResponse from "../models/value_objects/contracts/response/long_form_qas/QaResponse.ts";
import SearchResponse from "../models/value_objects/contracts/response/passage_searchs/SearchResponse.ts";


export function getDocumentTableRows(documents: Document[], documentTypes: DocumentType[]) {
    return documents.map((document) => {
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

export interface DocumentTableRow {
    id: string | undefined,
    name: string | undefined,
    description: string | undefined,
    documentTypeName: string | undefined,
    documentTypeId: string | undefined,
    accountId: string | undefined,
}


export interface AccountDomain {
    currentAccount: Account | undefined
}

export interface DocumentDomain {
    accountDocuments: Document[] | undefined
    documentTypes: DocumentType[] | undefined
}

export interface ModalDomain {
    isShow: boolean | undefined;
    name: string | undefined;
}

export interface CurrentDomain {
    account: Account | undefined
    document: Document | undefined
    documentType: DocumentType | undefined
    fileDocument: FileDocument | undefined,
    textDocument: TextDocument | undefined,
    webDocument: WebDocument | undefined,
    qaResponse: QaResponse | undefined,
    searchResponse: SearchResponse | undefined,
    fileDocumentProperty: FileDocumentPropertyResponse | undefined,
    documentTableRows: DocumentTableRow[] | undefined,
}


export interface DomainState {
    accountDomain: AccountDomain
    documentDomain: DocumentDomain
    currentDomain: CurrentDomain
    modalDomain: ModalDomain
}

export default createSlice({
    name: 'domain',
    initialState: <DomainState>{
        accountDomain: <AccountDomain>{
            currentAccount: undefined
        },
        documentDomain: <DocumentDomain>{
            accountDocuments: [],
            documentTypes: []
        },
        modalDomain: <ModalDomain>{
            isShow: false,
            name: undefined
        },
        currentDomain: <CurrentDomain>{
            account: undefined,
            document: undefined,
            documentType: undefined,
            fileDocument: undefined,
            textDocument: undefined,
            webDocument: undefined,
            qaResponse: undefined,
            searchResponse: undefined,
            fileDocumentProperty: undefined,
            documentTableRows: [],
        }
    },
    reducers: {
        setAccountDomain: (state, action) => {
            state.accountDomain = {...state.accountDomain, ...action.payload};
        },
        setDocumentDomain: (state, action) => {
            state.documentDomain = {...state.documentDomain, ...action.payload};
        },
        setModalDomain: (state, action) => {
            state.modalDomain = {...state.modalDomain, ...action.payload};
        },
        setCurrentDomain: (state, action) => {
            state.currentDomain = {...state.currentDomain, ...action.payload};
        },
    },
});



