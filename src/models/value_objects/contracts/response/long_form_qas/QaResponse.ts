import Response from "../Response.ts";
import RetrievedDocument from "./RetrievedDocument.ts";

export default class QaResponse extends Response {
    retrievedDocuments: RetrievedDocument[] | undefined;
    generatedAnswer: string | undefined;
    processDuration: number | undefined;

    constructor(
        retrievedDocuments: RetrievedDocument[] | undefined,
        generatedAnswer: string | undefined,
        processDuration: number | undefined
    ) {
        super()
        this.retrievedDocuments = retrievedDocuments;
        this.generatedAnswer = generatedAnswer;
        this.processDuration = processDuration;
    }
}