import Request from "../Request.ts";
import OnlineGeneratorModel from "./OnlineGeneratorModel.ts";

export default class Generator extends Request {
    sourceType: string | undefined;
    generatorModel: OnlineGeneratorModel | undefined;
    answerMaxLength: number | undefined;
    prompt: string | undefined;

    constructor(sourceType: string | undefined, generatorModel: OnlineGeneratorModel | undefined, answerMaxLength: number | undefined, prompt: string | undefined) {
        super()
        this.sourceType = sourceType;
        this.generatorModel = generatorModel;
        this.answerMaxLength = answerMaxLength;
        this.prompt = prompt;
    }
}
