import DenseEmbeddingModel from "./DenseEmbeddingModel.ts";
import OnlineEmbeddingModel from "./OnlineEmbeddingModel.ts";
import MultihopEmbeddingModel from "./MultihopEmbeddingModel.ts";
import Retriever from "./Retriever.ts";

export default class DenseRetriever extends Retriever {
    embeddingModel: DenseEmbeddingModel | MultihopEmbeddingModel | OnlineEmbeddingModel | undefined;

    constructor(
        embeddingModel: DenseEmbeddingModel | MultihopEmbeddingModel | OnlineEmbeddingModel | undefined,
        sourceType: string | undefined,
        topK: number | undefined,
        similarityFunction: string | undefined,
        isRefresh: boolean | undefined
    ) {
        super(sourceType, topK, similarityFunction, isRefresh)
        this.embeddingModel = embeddingModel;
    }
}
