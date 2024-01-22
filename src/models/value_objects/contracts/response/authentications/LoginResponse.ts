import Response from "../Response.ts";
import Account from "../../../../entities/Account.ts";

export default class LoginResponse extends Response {

    account?: Account;

    constructor(account?: Account) {
        super();
        this.account = account;
    }

}
