import GeneratorModel from "./GeneratorModel.ts";

export default class OnlineGeneratorModel extends GeneratorModel {
    apiKey: string | undefined;

    constructor(model: string | undefined, apiKey: string | undefined) {
        super(model)
        this.apiKey = apiKey;
    }
}
