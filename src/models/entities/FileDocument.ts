import Document from "./Document.ts";

export default class FileDocument extends Document {
    fileName: string | undefined;
    fileExtension: string | undefined;
    fileBytes: string | undefined;

    constructor(id: string | undefined, name: string | undefined, description: string | undefined, documentTypeId: string | undefined, accountId: string | undefined, fileName: string | undefined, fileExtension: string | undefined, fileBytes: string | undefined) {
        super(id, name, description, documentTypeId, accountId);
        this.fileName = fileName;
        this.fileExtension = fileExtension;
        this.fileBytes = fileBytes;
    }
}