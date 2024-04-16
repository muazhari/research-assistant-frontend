import { createSlice } from '@reduxjs/toolkit'
import type Account from '../models/daos/Account.ts'
import type Document from '../models/daos/Document.ts'
import type FileDocument from '../models/daos/FileDocument.ts'
import type TextDocument from '../models/daos/TextDocument.ts'
import type WebDocument from '../models/daos/WebDocument.ts'
import type LongFormQaProcessResponse from '../models/dtos/contracts/response/long_form_qas/ProcessResponse.ts'
import type PassageSearchProcessResponse from '../models/dtos/contracts/response/passage_searchs/ProcessResponse.ts'

export interface AccountDomain {
  currentAccount?: Account
}

export interface DocumentDomain {
  documents?: Document[]
}

export interface ModalDomain {
  isShow?: boolean
  name?: string
}

export interface CurrentDomain {
  account?: Account
  document?: Document
  fileDocument?: FileDocument
  textDocument?: TextDocument
  webDocument?: WebDocument
  qaProcess?: LongFormQaProcessResponse
  searchProcess?: PassageSearchProcessResponse
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
    documents: []
  },
  modalDomain: {
    isShow: false,
    name: undefined
  },
  currentDomain: {
    account: undefined,
    document: undefined,
    fileDocument: undefined,
    textDocument: undefined,
    webDocument: undefined,
    qaProcess: undefined,
    searchProcess: undefined
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
