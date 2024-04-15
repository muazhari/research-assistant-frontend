import { createSlice } from '@reduxjs/toolkit'
import type Account from '../models/entities/Account.ts'
import type Document from '../models/entities/Document.ts'
import type DocumentType from '../models/entities/DocumentType.ts'
import type FileDocument from '../models/entities/FileDocument.ts'
import type TextDocument from '../models/entities/TextDocument.ts'
import type WebDocument from '../models/entities/WebDocument.ts'
import type FileDocumentPropertyResponse
  from '../models/value_objects/contracts/response/managements/FileDocumentPropertyResponse.ts'
import type QaResponse from '../models/value_objects/contracts/response/long_form_qas/QaResponse.ts'
import type SearchResponse from '../models/value_objects/contracts/response/passage_searchs/SearchResponse.ts'

export function getDocumentTableRows (documents: Document[], documentTypes: DocumentType[]): DocumentTableRow[] {
  return documents.map((document) => {
    return {
      id: document.id,
      name: document.name,
      description: document.description,
      documentTypeId: document.documentTypeId,
      accountId: document.accountId,
      documentTypeName: documentTypes.find((documentType) => {
        return documentType.id === document.documentTypeId
      })!.name
    }
  })
}

export interface DocumentTableRow {
  id?: string
  name?: string
  description?: string
  documentTypeName?: string
  documentTypeId?: string
  accountId?: string
}

export interface AccountDomain {
  currentAccount?: Account
}

export interface DocumentDomain {
  accountDocuments?: Document[]
  documentTypes?: DocumentType[]
}

export interface ModalDomain {
  isShow?: boolean
  name?: string
}

export interface CurrentDomain {
  account?: Account
  document?: Document
  documentType?: DocumentType
  fileDocument?: FileDocument
  textDocument?: TextDocument
  webDocument?: WebDocument
  qaResponse?: QaResponse
  searchResponse?: SearchResponse
  fileDocumentProperty?: FileDocumentPropertyResponse
  documentTableRows?: DocumentTableRow[]
}

export interface DomainState {
  accountDomain?: AccountDomain
  documentDomain?: DocumentDomain
  currentDomain?: CurrentDomain
  modalDomain?: ModalDomain
}

const initialState: DomainState = {
  accountDomain: {
    currentAccount: undefined
  },
  documentDomain: {
    accountDocuments: [],
    documentTypes: []
  },
  modalDomain: {
    isShow: false,
    name: undefined
  },
  currentDomain: {
    account: undefined,
    document: undefined,
    documentType: undefined,
    fileDocument: undefined,
    textDocument: undefined,
    webDocument: undefined,
    qaResponse: undefined,
    searchResponse: undefined,
    fileDocumentProperty: undefined,
    documentTableRows: []
  }
}

export default createSlice({
  name: 'domain',
  initialState,
  reducers: {
    setAccountDomain: (state, action) => {
      state.accountDomain = { ...state.accountDomain, ...action.payload }
    },
    setDocumentDomain: (state, action) => {
      state.documentDomain = { ...state.documentDomain, ...action.payload }
    },
    setModalDomain: (state, action) => {
      state.modalDomain = { ...state.modalDomain, ...action.payload }
    },
    setCurrentDomain: (state, action) => {
      state.currentDomain = { ...state.currentDomain, ...action.payload }
    }
  }
})
