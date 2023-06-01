import ValueObject from "../ValueObject.ts";

export default class Content<T> extends ValueObject {

    message: string | undefined;
    data: T | undefined;

    constructor(message: string | undefined, data: T | undefined) {
        super()
        this.message = message;
        this.data = data;
    }
}
