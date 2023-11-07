import Request from "../Request.ts";

export default class BaseRankerModel extends Request {
    model: string | undefined;

    constructor(model: string | undefined) {
        super()
        this.model = model;
    }
}
