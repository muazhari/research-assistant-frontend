import Request from "../Request.ts";

export default  class QuerySetting extends Request {
    prefix?: string;

    constructor(prefix?: string) {
        super();
        this.prefix = prefix;
    }
}
