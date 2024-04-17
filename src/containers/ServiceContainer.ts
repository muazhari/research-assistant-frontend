import AccountService from '../services/AccountService.ts'
import AuthenticationService from '../services/AuthenticationService.ts'
import AuthorizationService from '../services/AuthorizationService.ts'
import DocumentService from '../services/DocumentService.ts'
import DocumentTypeService from '../services/DocumentTypeService.ts'
import FileDocumentService from '../services/FileDocumentService.ts'
import TextDocumentService from '../services/TextDocumentService.ts'
import WebDocumentService from '../services/WebDocumentService.ts'
import LongFormQaService from '../services/LongFormQaService.ts'
import PassageSearchService from '../services/PassageSearchService.ts'
import BackendOneClient from '../clients/BackendOneClient.ts'

const backendOneClient: BackendOneClient = new BackendOneClient()
const accountService: AccountService = new AccountService(backendOneClient)
const authenticationService: AuthenticationService = new AuthenticationService(backendOneClient)
const authorizationService: AuthorizationService = new AuthorizationService(backendOneClient)
const documentService: DocumentService = new DocumentService(backendOneClient)
const documentTypeService: DocumentTypeService = new DocumentTypeService(backendOneClient)
const fileDocumentService: FileDocumentService = new FileDocumentService(backendOneClient)
const textDocumentService: TextDocumentService = new TextDocumentService(backendOneClient)
const webDocumentService: WebDocumentService = new WebDocumentService(backendOneClient)
const longFormQaService: LongFormQaService = new LongFormQaService(backendOneClient)
const passageSearchService: PassageSearchService = new PassageSearchService(backendOneClient)

export {
  accountService,
  authenticationService,
  authorizationService,
  documentService,
  documentTypeService,
  fileDocumentService,
  textDocumentService,
  webDocumentService,
  longFormQaService,
  passageSearchService
}
