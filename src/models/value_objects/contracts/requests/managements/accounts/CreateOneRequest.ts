import Request from "../../Request.ts";
import CreateBody from "./CreateBody.ts";

export default class CreateOneRequest extends Request {
    body: CreateBody

    constructor(body: CreateBody) {
        super();
        this.body = body;
    }
}
