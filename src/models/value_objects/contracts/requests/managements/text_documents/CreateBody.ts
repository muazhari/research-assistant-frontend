import DocumentCreateBody from "../documents/CreateBody.ts";

export default class CreateBody extends DocumentCreateBody {
    textContent: string | undefined;

    constructor(name: string | undefined, description: string | undefined, documentTypeId: string | undefined, accountId: string | undefined, textContent: string | undefined) {
        super(name, description, documentTypeId, accountId);
        this.textContent = textContent;
    }
}
