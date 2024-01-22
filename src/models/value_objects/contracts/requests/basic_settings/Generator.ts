import Request from "../Request.ts";
import OnlineGeneratorModel from "./OnlineGeneratorModel.ts";

export default class Generator extends Request {
    sourceType?: string;
    generatorModel?: OnlineGeneratorModel;
    answerMaxLength?: number;
    prompt?: string;

    constructor(sourceType?: string, generatorModel?: OnlineGeneratorModel, answerMaxLength?: number, prompt?: string) {
        super()
        this.sourceType = sourceType;
        this.generatorModel = generatorModel;
        this.answerMaxLength = answerMaxLength;
        this.prompt = prompt;
    }
}
