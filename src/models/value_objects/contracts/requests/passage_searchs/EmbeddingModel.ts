import Request from "../Request.ts";

export default class EmbeddingModel extends Request {
    dimension: number | undefined;

    constructor(dimension: number | undefined) {
        super()
        this.dimension = dimension;
    }
}
