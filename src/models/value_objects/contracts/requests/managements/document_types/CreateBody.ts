import ValueObject from "../../../../ValueObject.ts";

export default class CreateBody extends ValueObject {
    name: string | undefined;
    description: string | undefined;

    constructor(name: string | undefined, description: string | undefined) {
        super();
        this.name = name;
        this.description = description;
    }
}

