import Document from "./Document.ts";

export default class WebDocument extends Document {
    webUrl?: string;

    constructor(id?: string, name?: string, description?: string, documentTypeId?: string, accountId?: string, webUrl?: string) {
        super(id, name, description, documentTypeId, accountId);
        this.webUrl = webUrl;
    }
}
