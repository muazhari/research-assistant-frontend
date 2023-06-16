import Retriever from "./Retriever.ts";

export default class SparseRetriever extends Retriever {

    model: string | undefined;

    constructor(
        model: string | undefined,
        sourceType: string | undefined,
        topK: number | undefined,
        similarityFunction: string | undefined,
        isRefresh: boolean | undefined
    ) {
        super(sourceType, topK, similarityFunction, isRefresh)
        this.model = model;
    }
}
