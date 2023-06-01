import Request from "../Request.ts";

export default class Ranker extends Request {
    sourceType: string | undefined;
    model: string | undefined;
    topK: number | undefined;

    constructor(sourceType: string | undefined, model: string | undefined, topK: number | undefined) {
        super()
        this.sourceType = sourceType;
        this.model = model;
        this.topK = topK;
    }
}
