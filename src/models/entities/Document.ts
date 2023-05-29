class Account extends Entity {
    id: string | undefined;
    name: string | undefined;
    email: string | undefined;
    password: string | undefined;

    constructor(id: string | undefined, name: string | undefined, email: string | undefined, password: string | undefined) {
        super();
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }
}