import Entity from "./Entity.ts";

export default class Document extends Entity {
    id?: string;
    name?: string;
    description?: string;
    documentTypeId?: string;
    accountId?: string;

    constructor(id?: string, name?: string, description?: string, documentTypeId?: string, accountId?: string) {
        super();
        this.id = id;
        this.name = name;
        this.description = description;
        this.documentTypeId = documentTypeId;
        this.accountId = accountId;
    }
}
