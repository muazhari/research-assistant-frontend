import DocumentPatchBody from "../documents/PatchBody.ts";

export default class PatchBody extends DocumentPatchBody {
    textContent: string | undefined;

    constructor(name: string | undefined, description: string | undefined, documentTypeId: string | undefined, accountId: string | undefined, textContent: string | undefined) {
        super(name, description, documentTypeId, accountId);
        this.textContent = textContent;
    }
}
