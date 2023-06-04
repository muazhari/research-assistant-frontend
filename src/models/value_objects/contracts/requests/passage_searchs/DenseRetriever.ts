import Request from "../Request.ts";
import DenseEmbeddingModel from "./DenseEmbeddingModel.ts";
import OnlineEmbeddingModel from "./OnlineEmbeddingModel.ts";
import MultihopEmbeddingModel from "./MultihopEmbeddingModel.ts";

export default class DenseRetriever extends Request {
    similarityFunction: string | undefined;
    sourceType: string | undefined;
    topK: number | undefined;
    isRefresh: boolean | undefined;
    embeddingModel: DenseEmbeddingModel | MultihopEmbeddingModel | OnlineEmbeddingModel | undefined;

    constructor(similarityFunction: string | undefined, sourceType: string | undefined, topK: number | undefined, isRefresh: boolean | undefined, embeddingModel: DenseEmbeddingModel | undefined) {
        super()
        this.similarityFunction = similarityFunction;
        this.sourceType = sourceType;
        this.topK = topK;
        this.isRefresh = isRefresh;
        this.embeddingModel = embeddingModel;
    }
}
