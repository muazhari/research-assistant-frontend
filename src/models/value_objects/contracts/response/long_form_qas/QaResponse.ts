import Response from "../Response.ts";
import RetrievedDocument from "../passage_searchs/RetrievedDocument.ts";

export default class QaResponse extends Response {
    retrievedDocuments?: RetrievedDocument[];
    generatedAnswer?: string;
    processDuration?: number;

    constructor(
        retrievedDocuments?: RetrievedDocument[],
        generatedAnswer?: string,
        processDuration?: number 
   ) {
        super()
        this.retrievedDocuments = retrievedDocuments;
        this.generatedAnswer = generatedAnswer;
        this.processDuration = processDuration;
    }
}
