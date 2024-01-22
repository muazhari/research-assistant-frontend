import Request from "../Request.ts";

export default class LoginBody extends Request {

    email?: string;
    password?: string;

    constructor(email?: string, password?: string) {
        super();
        this.email = email;
        this.password = password;
    }
}
