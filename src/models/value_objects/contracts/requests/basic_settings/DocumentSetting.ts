import Request from "../Request.ts";
import FileDocumentSetting from "./FileDocumentSetting.ts";
import TextDocumentSetting from "./TextDocumentSetting.ts";
import WebDocumentSetting from "./WebDocumentSetting.ts";

export default class DocumentSetting extends Request {
    documentId?: string;
    detailSetting?: FileDocumentSetting | TextDocumentSetting | WebDocumentSetting;
    prefix?: string;

    constructor(documentId?: string, detailSetting?: FileDocumentSetting | TextDocumentSetting | WebDocumentSetting, prefix?: string) {
        super()
        this.documentId = documentId;
        this.detailSetting = detailSetting;
        this.prefix = prefix;
    }
}
