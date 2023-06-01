import Request from "../Request.ts";

export default class OutputSetting extends Request {
    documentTypeId: string | undefined;

    constructor(documentTypeId: string | undefined) {
        super()
        this.documentTypeId = documentTypeId;
    }
}
