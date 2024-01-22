import DocumentPatchBody from "../documents/PatchBody.ts";

export default class PatchBody extends DocumentPatchBody {
    webUrl?: string;

    constructor(name?: string, description?: string, documentTypeId?: string, accountId?: string, webUrl?: string) {
        super(name, description, documentTypeId, accountId);
        this.webUrl = webUrl;
    }
}
