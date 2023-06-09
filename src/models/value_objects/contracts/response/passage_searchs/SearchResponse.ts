import Response from "../Response.ts";
import TextDocument from "../../../../entities/TextDocument.ts";
import WebDocument from "../../../../entities/WebDocument.ts";
import FileDocument from "../../../../entities/FileDocument.ts";
import RetrievedDocument from "./RetrievedDocument.ts";

export default class SearchResponse extends Response {
    retrievedDocuments: RetrievedDocument[] | undefined;
    outputDocument: FileDocument | TextDocument | WebDocument | undefined;
    processDuration: number | undefined;

    constructor(
        retrievedDocuments: RetrievedDocument[] | undefined,
        outputDocument: FileDocument | TextDocument | WebDocument | undefined,
        processDuration: number | undefined
    ) {
        super()
        this.retrievedDocuments = retrievedDocuments;
        this.outputDocument = outputDocument;
        this.processDuration = processDuration;
    }

}