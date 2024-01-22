import DenseEmbeddingModel from "./DenseEmbeddingModel.ts";
import OnlineEmbeddingModel from "./OnlineEmbeddingModel.ts";
import MultihopEmbeddingModel from "./MultihopEmbeddingModel.ts";
import Retriever from "./Retriever.ts";

export default class DenseRetriever extends Retriever {
    embeddingModel?: DenseEmbeddingModel | MultihopEmbeddingModel | OnlineEmbeddingModel;

    constructor(
        embeddingModel?: DenseEmbeddingModel | MultihopEmbeddingModel | OnlineEmbeddingModel,
        sourceType?: string,
        topK?: number,
        similarityFunction?: string,
        isRefresh?: boolean 
   ) {
        super(sourceType, topK, similarityFunction, isRefresh)
        this.embeddingModel = embeddingModel;
    }
}
