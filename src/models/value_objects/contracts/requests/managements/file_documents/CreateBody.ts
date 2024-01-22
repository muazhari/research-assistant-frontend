import DocumentCreateBody from "../documents/CreateBody.ts";

export default class CreateBody extends DocumentCreateBody {
    fileName?: string;
    fileExtension?: string;
    fileBytes?: string;

    constructor(name?: string, description?: string, documentTypeId?: string, accountId?: string, fileName?: string, fileExtension?: string, fileBytes?: string) {
        super(name, description, documentTypeId, accountId);
        this.fileName = fileName;
        this.fileExtension = fileExtension;
        this.fileBytes = fileBytes;
    }

}
