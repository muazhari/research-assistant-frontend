import ValueObject from "../ValueObject.ts";

export default class Content<T> extends ValueObject {

    message: string | undefined;
    data: T;

    constructor(message: string | undefined, data: T) {
        super();
        this.message = message;
        this.data = data;
    }
}
