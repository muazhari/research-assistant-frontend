import Request from "../Request.ts";

export default class Retriever extends Request {
    sourceType: string | undefined;
    topK: number | undefined;
    similarityFunction: string | undefined;
    isRefresh: boolean | undefined;

    constructor(sourceType: string | undefined, topK: number | undefined, similarityFunction: string | undefined, isRefresh: boolean | undefined) {
        super()
        this.sourceType = sourceType;
        this.topK = topK;
        this.similarityFunction = similarityFunction;
        this.isRefresh = isRefresh;
    }
}
