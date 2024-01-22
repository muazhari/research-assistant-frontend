import ValueObject from "../../../../ValueObject.ts";

export default class CreateBody extends ValueObject {
    name?: string 
    email?: string 
    password?: string 

    constructor(name?: string, email?: string, password?: string) {
        super();
        this.name = name;
        this.email = email;
        this.password = password;
    }
}
