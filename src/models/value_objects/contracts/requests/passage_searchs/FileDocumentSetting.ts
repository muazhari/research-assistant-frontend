import Request from "../Request.ts";

export default class FileDocumentSetting extends Request {
    startPage: number | undefined;
    endPage: number | undefined;

    constructor(startPage: number | undefined, endPage: number | undefined) {
        super()
        this.startPage = startPage;
        this.endPage = endPage;
    }
}
