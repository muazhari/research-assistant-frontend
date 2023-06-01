import DocumentCreateBody from "../documents/CreateBody.ts";

export default class CreateBody extends DocumentCreateBody {
    webUrl: string | undefined;

    constructor(name: string | undefined, description: string | undefined, documentTypeId: string | undefined, accountId: string | undefined, webUrl: string | undefined) {
        super(name, description, documentTypeId, accountId);
        this.webUrl = webUrl;
    }
}
