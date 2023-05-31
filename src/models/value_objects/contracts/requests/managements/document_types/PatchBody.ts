import ValueObject from "../../../../ValueObject.ts";

export default class PatchBody extends ValueObject {
    name: string | undefined;
    description: string | undefined;

    constructor(name: string | undefined, description: string | undefined) {
        super();
        this.name = name;
        this.description = description;
    }
}
