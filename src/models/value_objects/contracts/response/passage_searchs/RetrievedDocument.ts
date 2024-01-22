import Response from "../Response.ts";


export default class RetrievedDocument extends Response {
    id?: string;
    content?: string;
    contentType?: string;
    meta?: any;
    idHashKeys?: string[];
    score?: number;
    embedding?: string;

    constructor(
        id?: string,
        content?: string,
        contentType?: string,
        meta?: any,
        idHashKeys?: string[],
        score?: number,
        embedding?: string 
   ) {
        super()
        this.id = id;
        this.content = content;
        this.contentType = contentType;
        this.meta = meta;
        this.idHashKeys = idHashKeys;
        this.score = score;
        this.embedding = embedding;
    }
}
