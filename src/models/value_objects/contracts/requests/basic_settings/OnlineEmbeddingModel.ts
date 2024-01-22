import EmbeddingModel from "./EmbeddingModel.ts";

export default class OnlineEmbeddingModel extends EmbeddingModel {
    model?: string;
    num_iterations?: number;

    constructor(dimension?: number, model?: string, num_iterations?: number) {
        super(dimension)
        this.model = model;
        this.num_iterations = num_iterations;
    }
}
