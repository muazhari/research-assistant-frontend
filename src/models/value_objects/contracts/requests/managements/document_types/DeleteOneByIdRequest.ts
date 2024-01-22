import Request from "../../Request.ts";

export default class DeleteOneByIdRequest extends Request {
    id?: string 

    constructor(id?: string) {
        super();
        this.id = id;
    }
}
