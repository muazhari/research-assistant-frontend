import DocumentPatchBody from "../documents/PatchBody.ts";

export default class PatchBody extends DocumentPatchBody {
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
