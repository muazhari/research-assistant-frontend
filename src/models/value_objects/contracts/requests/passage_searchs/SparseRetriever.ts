import Retriever from "./Retriever.ts";

export default class SparseRetriever extends Retriever {

    model: string | undefined;

    constructor(model: string | undefined, sourceType: string | undefined, topK: number | undefined, similarityFunction: string | undefined) {
        super(sourceType, topK, similarityFunction)
        this.model = model;
    }
}
