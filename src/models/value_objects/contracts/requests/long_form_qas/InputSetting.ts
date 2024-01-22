import DocumentSetting from "../basic_settings/DocumentSetting.ts";
import DenseRetriever from "../basic_settings/DenseRetriever.ts";
import SparseRetriever from "../basic_settings/SparseRetriever.ts";
import Generator from "../basic_settings/Generator.ts";
import Request from "../Request.ts";
import Ranker from "../basic_settings/Ranker.ts";
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
    generator?: Generator;

    constructor(
        query?: string,
        granularity?: string,
        windowSizes?: number[],
        querySetting?: QuerySetting,
        documentSetting?: DocumentSetting,
        denseRetriever?: DenseRetriever,
        sparseRetriever?: SparseRetriever,
        ranker?: Ranker,
        generator?: Generator
   ) {
        super()
        this.query = query;
        this.granularity = granularity;
        this.windowSizes = windowSizes;
        this.querySetting = querySetting;
        this.documentSetting = documentSetting;
        this.denseRetriever = denseRetriever;
        this.sparseRetriever = sparseRetriever;
        this.ranker = ranker;
        this.generator = generator;
    }
}
