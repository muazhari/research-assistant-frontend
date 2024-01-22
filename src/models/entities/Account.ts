import Entity from "./Entity.ts";

export default class Account extends Entity {
    id?: string;
    name?: string;
    email?: string;
    password?: string;

    constructor(id?: string, name?: string, email?: string, password?: string) {
        super();
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }
}
