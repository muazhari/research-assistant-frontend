import Response from "../Response.ts";

export default class FileDocumentPropertyResponse extends Response {
    pageLength: number | undefined

    constructor(pageLength: number | undefined) {
        super()
        this.pageLength = pageLength;
    }
}
