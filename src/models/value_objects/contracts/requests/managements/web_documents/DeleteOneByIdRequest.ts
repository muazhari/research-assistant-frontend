import Request from "../../Request.ts";

export default class DeleteOneByIdRequest extends Request {
    id: string | undefined

    constructor(id: string | undefined) {
        super();
        this.id = id;
    }
}
