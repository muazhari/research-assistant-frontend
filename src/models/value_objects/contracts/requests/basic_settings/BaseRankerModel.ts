import Request from "../Request.ts";

export default class BaseRankerModel extends Request {
    model?: string;

    constructor(model?: string) {
        super()
        this.model = model;
    }
}
