import PatchBody from "./PatchBody.ts";
import Request from "../../Request.ts";

export default class PatchOneByIdRequest extends Request {
    id: string | undefined
    body: PatchBody

    constructor(id: string | undefined, body: PatchBody) {
        super();
        this.id = id;
        this.body = body;
    }
}
