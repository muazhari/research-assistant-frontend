import Request from "../Request.ts";

export default class LoginBody extends Request {

    email: string | undefined;
    password: string | undefined;

    constructor(email: string | undefined, password: string | undefined) {
        super();
        this.email = email;
        this.password = password;
    }
}
