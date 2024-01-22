import Request from "../Request.ts";

export default class FileDocumentSetting extends Request {
    startPage?: number;
    endPage?: number;

    constructor(startPage?: number, endPage?: number) {
        super()
        this.startPage = startPage;
        this.endPage = endPage;
    }
}
