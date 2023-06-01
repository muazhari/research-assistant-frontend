import DocumentSetting from "./DocumentSetting.ts";
import Request from "../Request.ts";
import Ranker from "./Ranker.ts";
import DenseRetriever from "./DenseRetriever.ts";
import SparseRetriever from "./SparseRetriever.ts";

export default class InputSetting extends Request {
    documentSetting: DocumentSetting | undefined;
    query: string | undefined;
    granularity: string | undefined;
    windowSizes: number[] | undefined;
    denseRetriever: DenseRetriever | undefined;
    sparseRetriever: SparseRetriever | undefined;
    ranker: Ranker | undefined;

    constructor(
        documentSetting: DocumentSetting | undefined,
        query: string | undefined,
        granularity: string | undefined,
        windowSizes: number[] | undefined,
        denseRetriever: DenseRetriever | undefined,
        sparseRetriever: SparseRetriever | undefined,
        ranker: Ranker | undefined
    ) {
        super()
        this.documentSetting = documentSetting;
        this.query = query;
        this.granularity = granularity;
        this.windowSizes = windowSizes;
        this.denseRetriever = denseRetriever
        this.sparseRetriever = sparseRetriever
        this.ranker = ranker;
    }
}
