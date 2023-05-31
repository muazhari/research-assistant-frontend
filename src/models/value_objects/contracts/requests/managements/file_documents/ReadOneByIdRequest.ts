import Request from "../../Request.ts";

export default class ReadOneByIdRequest extends Request {
    id: string | undefined

    constructor(id: string | undefined) {
        super();
        this.id = id;
    }
}
