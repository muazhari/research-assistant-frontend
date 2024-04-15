import { createSlice } from '@reduxjs/toolkit'
import type Account from '../models/daos/Account.ts'
import type Document from '../models/daos/Document.ts'
import type DocumentType from '../models/daos/DocumentType.ts'
import type FileDocument from '../models/daos/FileDocument.ts'
import type TextDocument from '../models/daos/TextDocument.ts'
import type WebDocument from '../models/daos/WebDocument.ts'
import type FileDocumentPropertyResponse
  from '../models/dtos/contracts/response/managements/FileDocumentPropertyResponse.ts'
import type ProcessResponse from '../models/dtos/contracts/response/long_form_qas/ProcessResponse.ts'
import type ProcessResponse from '../models/dtos/contracts/response/passage_searchs/ProcessResponse.ts'

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
      })!.id
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
  qaProcess?: ProcessResponse
  searchProcess?: ProcessResponse
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
    qaProcess: undefined,
    searchProcess: undefined,
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
