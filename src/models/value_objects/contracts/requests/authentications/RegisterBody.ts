import Request from "../Request.ts";

export default class RegisterBody extends Request {

    name: string | undefined;
    email: string | undefined;
    password: string | undefined;

    constructor(name: string | undefined, email: string | undefined, password: string | undefined) {
        super();
        this.name = name;
        this.email = email;
        this.password = password;
    }
}
