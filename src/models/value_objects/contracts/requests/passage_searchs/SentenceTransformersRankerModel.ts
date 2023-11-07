import BaseRankerModel from "./BaseRankerModel.ts";

export default class SentenceTransformersRankerModel extends BaseRankerModel {

    constructor(model: string | undefined) {
        super(model)
    }
}
