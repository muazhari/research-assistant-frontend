import DocumentPatchBody from "../documents/PatchBody.ts";

export default class PatchBody extends DocumentPatchBody {
    webUrl: string | undefined;

    constructor(name: string | undefined, description: string | undefined, documentTypeId: string | undefined, accountId: string | undefined, webUrl: string | undefined) {
        super(name, description, documentTypeId, accountId);
        this.webUrl = webUrl;
    }
}
