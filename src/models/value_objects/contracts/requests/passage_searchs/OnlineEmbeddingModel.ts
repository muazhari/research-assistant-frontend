import EmbeddingModel from "./EmbeddingModel.ts";

export default class OnlineEmbeddingModel extends EmbeddingModel {
    model: string | undefined;
    num_iterations: number | undefined;

    constructor(dimension: number | undefined, model: string | undefined, num_iterations: number | undefined) {
        super(dimension)
        this.model = model;
        this.num_iterations = num_iterations;
    }
}
