import EmbeddingModel from "./EmbeddingModel.ts";

export default class MultihopEmbeddingModel extends EmbeddingModel {
    model: string | undefined;
    apiKey: string | undefined;

    constructor(dimension: number | undefined, model: string | undefined, apiKey: string | undefined) {
        super(dimension)
        this.model = model;
        this.apiKey = apiKey;
    }
}
