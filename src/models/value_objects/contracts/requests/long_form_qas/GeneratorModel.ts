import Request from "../Request.ts";

export default class GeneratorModel extends Request {
    model: string | undefined;

    constructor(model: string | undefined) {
        super()
        this.model = model;
    }
}
