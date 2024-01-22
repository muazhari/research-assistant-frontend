import Entity from "./Entity.ts";

export default class DocumentType extends Entity {
    id?: string;
    name?: string;
    description?: string;

    constructor(id?: string, name?: string, description?: string) {
        super();
        this.id = id;
        this.name = name;
        this.description = description;
    }
}
