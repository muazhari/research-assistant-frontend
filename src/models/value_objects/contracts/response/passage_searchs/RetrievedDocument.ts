import Response from "../Response.ts";


export default class RetrievedDocument extends Response {
    id: string | undefined;
    content: string | undefined;
    contentType: string | undefined;
    meta: any | undefined;
    idHashKeys: string[] | undefined;
    score: number | undefined;
    embedding: string | undefined;

    constructor(
        id: string | undefined,
        content: string | undefined,
        contentType: string | undefined,
        meta: any | undefined,
        idHashKeys: string[] | undefined,
        score: number | undefined,
        embedding: string | undefined
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