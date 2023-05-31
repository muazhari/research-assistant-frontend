import Response from "../Response.ts";
import Account from "../../../../entities/Account.ts";


export default class RegisterResponse extends Response {

    account: Account | undefined;

    constructor(account: Account | undefined) {
        super();
        this.account = account;
    }

}
