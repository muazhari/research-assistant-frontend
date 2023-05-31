import Document from "./Document.ts";

export default class TextDocument extends Document {
    textContent: string | undefined;

    constructor(id: string | undefined, name: string | undefined, description: string | undefined, documentTypeId: string | undefined, accountId: string | undefined, textContent: string | undefined) {
        super(id, name, description, documentTypeId, accountId);
        this.textContent = textContent;
    }
}