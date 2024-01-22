import Request from "../Request.ts";

export default class Retriever extends Request {
    sourceType?: string;
    topK?: number;
    similarityFunction?: string;
    isRefresh?: boolean;

    constructor(sourceType?: string, topK?: number, similarityFunction?: string, isRefresh?: boolean) {
        super()
        this.sourceType = sourceType;
        this.topK = topK;
        this.similarityFunction = similarityFunction;
        this.isRefresh = isRefresh;
    }
}
