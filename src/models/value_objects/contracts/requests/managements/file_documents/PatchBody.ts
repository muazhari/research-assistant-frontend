import DocumentPatchBody from "../documents/PatchBody.ts";

export default class PatchBody extends DocumentPatchBody {
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
