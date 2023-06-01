import Request from "../Request.ts";

export default class Retriever extends Request {
    sourceType: string | undefined;
    topK: number | undefined;
    similarityFunction: string | undefined;

    constructor(sourceType: string | undefined, topK: number | undefined, similarityFunction: string | undefined) {
        super()
        this.sourceType = sourceType;
        this.topK = topK;
        this.similarityFunction = similarityFunction;
    }
}
