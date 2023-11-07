import Request from "../Request.ts";
import SentenceTransformersRankerModel from "./SentenceTransformersRankerModel.ts";
import OnlineRankerModel from "./OnlineRankerModel.ts";

export default class Ranker extends Request {
    sourceType: string | undefined;
    rankerModel: SentenceTransformersRankerModel | OnlineRankerModel | undefined;
    topK: number | undefined;

    constructor(sourceType: string | undefined, rankerModel: SentenceTransformersRankerModel | OnlineRankerModel | undefined, topK: number | undefined) {
        super()
        this.sourceType = sourceType;
        this.rankerModel = rankerModel;
        this.topK = topK;
    }
}
