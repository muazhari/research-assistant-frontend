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
const account: AccountService = new AccountService(backendOneClient)
const authentication: AuthenticationService = new AuthenticationService(backendOneClient)
const authorization: AuthorizationService = new AuthorizationService(backendOneClient)
const document: DocumentService = new DocumentService(backendOneClient)
const documentType: DocumentTypeService = new DocumentTypeService(backendOneClient)
const fileDocument: FileDocumentService = new FileDocumentService(backendOneClient)
const textDocument: TextDocumentService = new TextDocumentService(backendOneClient)
const webDocument: WebDocumentService = new WebDocumentService(backendOneClient)
const longFormQa: LongFormQaService = new LongFormQaService(backendOneClient)
const passageSearch: PassageSearchService = new PassageSearchService(backendOneClient)

export {
  account,
  authentication,
  authorization,
  document,
  documentType,
  fileDocument,
  textDocument,
  webDocument,
  longFormQa,
  passageSearch
}
