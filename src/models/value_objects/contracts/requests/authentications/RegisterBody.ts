import Request from "../Request.ts";

export default class RegisterBody extends Request {

    name?: string;
    email?: string;
    password?: string;

    constructor(name?: string, email?: string, password?: string) {
        super();
        this.name = name;
        this.email = email;
        this.password = password;
    }
}
