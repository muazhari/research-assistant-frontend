import ValueObject from "../../../../ValueObject.ts";

export default class PatchBody extends ValueObject {
    name?: string;
    description?: string;

    constructor(name?: string, description?: string) {
        super();
        this.name = name;
        this.description = description;
    }
}
