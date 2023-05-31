import ValueObject from "../../../../ValueObject.ts";

export default class CreateBody extends ValueObject {
    name: string | undefined;
    description: string | undefined;
    documentTypeId: string | undefined;
    accountId: string | undefined;

    constructor(name: string | undefined, description: string | undefined, documentTypeId: string | undefined, accountId: string | undefined) {
        super();
        this.name = name;
        this.description = description;
        this.documentTypeId = documentTypeId;
        this.accountId = accountId;
    }

}
