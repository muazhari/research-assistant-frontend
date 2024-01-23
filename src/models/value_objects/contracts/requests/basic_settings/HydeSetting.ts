import Request from "../Request.ts";
import Generator from "./Generator.ts";

export default  class HydeSetting extends Request {
    isUse?: boolean;
    generator?: Generator;

    constructor(isUse?: boolean, generator?: Generator) {
        super();
        this.isUse = isUse;
        this.generator = generator;
    }
}
