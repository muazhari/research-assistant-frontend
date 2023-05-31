import Request from "../../Request.ts";

export default class ReadAllByAccountIdRequest extends Request {
    accountId: string | undefined

    constructor(accountId: string | undefined) {
        super();
        this.accountId = accountId;
    }
}
