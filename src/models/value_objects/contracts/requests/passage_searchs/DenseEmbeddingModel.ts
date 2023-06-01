import EmbeddingModel from "./EmbeddingModel.ts";

export default class DenseEmbeddingModel extends EmbeddingModel {
    queryModel: string | undefined;
    passageModel: string | undefined;

    constructor(dimension: number | undefined, queryModel: string | undefined, passageModel: string | undefined) {
        super(dimension)
        this.queryModel = queryModel;
        this.passageModel = passageModel;
    }
}
