import DocumentPatchBody from "../documents/PatchBody.ts";

export default class PatchBody extends DocumentPatchBody {
    textContent?: string;

    constructor(name?: string, description?: string, documentTypeId?: string, accountId?: string, textContent?: string) {
        super(name, description, documentTypeId, accountId);
        this.textContent = textContent;
    }
}
