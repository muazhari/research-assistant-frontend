import {createSlice} from '@reduxjs/toolkit';
import Account from "../models/entities/Account.ts";
import Document from "../models/entities/Document.ts";
import DocumentType from "../models/entities/DocumentType.ts";
import FileDocument from "../models/entities/FileDocument.ts";
import TextDocument from "../models/entities/TextDocument.ts";
import WebDocument from "../models/entities/WebDocument.ts";
import RetrievedDocument from "../models/value_objects/contracts/response/long_form_qas/RetrievedDocument.ts";
import FileDocumentPropertyResponse
    from "../models/value_objects/contracts/response/managements/FileDocumentPropertyResponse.ts";


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
    webDocument: WebDocument | undefined
    generatedAnswer: string | undefined
    processDuration: number | undefined
    retrievedDocuments: RetrievedDocument[] | undefined
    fileDocumentProperty: FileDocumentPropertyResponse | undefined
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
            generatedAnswer: undefined,
            processDuration: undefined,
            retrievedDocuments: undefined,
            fileDocumentProperty: undefined
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
        }
    },
});



