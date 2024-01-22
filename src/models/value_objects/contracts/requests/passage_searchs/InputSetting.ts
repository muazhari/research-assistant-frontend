import DocumentSetting from "../basic_settings/DocumentSetting.ts";
import Request from "../Request.ts";
import Ranker from "../basic_settings/Ranker.ts";
import DenseRetriever from "../basic_settings/DenseRetriever.ts";
import SparseRetriever from "../basic_settings/SparseRetriever.ts";
import QuerySetting from "../basic_settings/QuerySetting.ts";

export default class InputSetting extends Request {
    query?: string;
    granularity?: string;
    windowSizes?: number[];
    querySetting?: QuerySetting;
    documentSetting?: DocumentSetting;
    denseRetriever?: DenseRetriever;
    sparseRetriever?: SparseRetriever;
    ranker?: Ranker;

    constructor(
        documentSetting?: DocumentSetting,
        query?: string,
        querySetting?: QuerySetting,
        granularity?: string,
        windowSizes?: number[],
        denseRetriever?: DenseRetriever,
        sparseRetriever?: SparseRetriever,
        ranker?: Ranker
   ) {
        super()
        this.query = query;
        this.querySetting = querySetting;
        this.granularity = granularity;
        this.windowSizes = windowSizes;
        this.documentSetting = documentSetting;
        this.denseRetriever = denseRetriever
        this.sparseRetriever = sparseRetriever
        this.ranker = ranker;
    }
}
