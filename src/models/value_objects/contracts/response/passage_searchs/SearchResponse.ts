import Response from "../Response.ts";
import TextDocument from "../../../../entities/TextDocument.ts";
import WebDocument from "../../../../entities/WebDocument.ts";
import FileDocument from "../../../../entities/FileDocument.ts";

export default class SearchResponse extends Response {
    outputDocument: FileDocument | TextDocument | WebDocument | undefined;
    processDuration: number | undefined;

    constructor(
        outputDocument: FileDocument | TextDocument | WebDocument | undefined,
        processDuration: number | undefined
    ) {
        super()
        this.outputDocument = outputDocument;
        this.processDuration = processDuration;
    }

}