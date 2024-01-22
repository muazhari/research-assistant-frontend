import Request from "../../Request.ts";

export default class ReadAllByAccountIdRequest extends Request {
    accountId?: string 

    constructor(accountId?: string) {
        super();
        this.accountId = accountId;
    }
}
