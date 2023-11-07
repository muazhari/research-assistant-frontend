import BaseRankerModel from "./BaseRankerModel.ts";

export default class OnlineRankerModel extends BaseRankerModel {
    apiKey: string | undefined;

    constructor(model: string | undefined, apiKey: string | undefined) {
        super(model)
        this.apiKey = apiKey;
    }
}
