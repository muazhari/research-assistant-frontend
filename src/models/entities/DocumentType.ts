import Entity from "./Entity.ts";

export default class DocumentType extends Entity {
    id: string | undefined;
    name: string | undefined;
    description: string | undefined;

    constructor(id: string | undefined, name: string | undefined, description: string | undefined) {
        super();
        this.id = id;
        this.name = name;
        this.description = description;
    }
}