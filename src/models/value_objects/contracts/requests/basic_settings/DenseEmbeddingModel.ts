import EmbeddingModel from "./EmbeddingModel.ts";

export default class DenseEmbeddingModel extends EmbeddingModel {
    queryModel?: string;
    passageModel?: string;

    constructor(dimension?: number, queryModel?: string, passageModel?: string) {
        super(dimension)
        this.queryModel = queryModel;
        this.passageModel = passageModel;
    }
}
