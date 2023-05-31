import DocumentCreateBody from "../documents/CreateBody.ts";

export default class CreateBody extends DocumentCreateBody {
    fileName: string | undefined;
    fileExtension: string | undefined;
    fileBytes: string | undefined;

    constructor(name: string | undefined, description: string | undefined, documentTypeId: string | undefined, accountId: string | undefined, fileName: string | undefined, fileExtension: string | undefined, fileBytes: string | undefined) {
        super(name, description, documentTypeId, accountId);
        this.fileName = fileName;
        this.fileExtension = fileExtension;
        this.fileBytes = fileBytes;
    }

}
