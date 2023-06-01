import Request from "../Request.ts";
import FileDocumentSetting from "./FileDocumentSetting.ts";
import TextDocumentSetting from "./TextDocumentSetting.ts";
import WebDocumentSetting from "./WebDocumentSetting.ts";

export default class DocumentSetting extends Request {
    documentId: string | undefined;
    detailSetting: FileDocumentSetting | TextDocumentSetting | WebDocumentSetting | undefined;

    constructor(documentId: string | undefined, detailSetting: FileDocumentSetting | TextDocumentSetting | WebDocumentSetting | undefined) {
        super()
        this.documentId = documentId;
        this.detailSetting = detailSetting;
    }
}
