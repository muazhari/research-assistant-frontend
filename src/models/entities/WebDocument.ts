import Document from "./Document.ts";

export default class WebDocument extends Document {
    webUrl: string | undefined;

    constructor(id: string | undefined, name: string | undefined, description: string | undefined, documentTypeId: string | undefined, accountId: string | undefined, webUrl: string | undefined) {
        super(id, name, description, documentTypeId, accountId);
        this.webUrl = webUrl;
    }
}