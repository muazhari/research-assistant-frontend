import ValueObject from "../ValueObject.ts";

export default class Content<T> extends ValueObject {

    message?: string;
    data?: T;

    constructor(message?: string, data?: T) {
        super()
        this.message = message;
        this.data = data;
    }
}
