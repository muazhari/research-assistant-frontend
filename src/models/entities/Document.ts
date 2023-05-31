import Entity from "./Entity.ts";

export default class Document extends Entity {
    id: string | undefined;
    name: string | undefined;
    description: string | undefined;
    documentTypeId: string | undefined;
    accountId: string | undefined;

    constructor(id: string | undefined, name: string | undefined, description: string | undefined, documentTypeId: string | undefined, accountId: string | undefined) {
        super();
        this.id = id;
        this.name = name;
        this.description = description;
        this.documentTypeId = documentTypeId;
        this.accountId = accountId;
    }
}