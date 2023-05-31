import ValueObject from "../../../../ValueObject.ts";

export default class PatchBody extends ValueObject {
    name: string | undefined
    email: string | undefined
    password: string | undefined

    constructor(name: string | undefined, email: string | undefined, password: string | undefined) {
        super();
        this.name = name;
        this.email = email;
        this.password = password;
    }
}
