import DocumentSetting from "../passage_searchs/DocumentSetting.ts";
import DenseRetriever from "../passage_searchs/DenseRetriever.ts";
import SparseRetriever from "../passage_searchs/SparseRetriever.ts";
import Generator from "./Generator.ts";
import Request from "../Request.ts";
import Ranker from "../passage_searchs/Ranker.ts";


export default class InputSetting extends Request {
    documentSetting: DocumentSetting | undefined;
    query: string | undefined;
    granularity: string | undefined;
    windowSizes: number[] | undefined;
    denseRetriever: DenseRetriever | undefined;
    sparseRetriever: SparseRetriever | undefined;
    ranker: Ranker | undefined;
    generator: Generator | undefined;

    constructor(
        documentSetting: DocumentSetting | undefined,
        query: string | undefined,
        granularity: string | undefined,
        windowSizes: number[] | undefined,
        denseRetriever: DenseRetriever | undefined,
        sparseRetriever: SparseRetriever | undefined,
        ranker: Ranker | undefined,
        generator: Generator | undefined
    ) {
        super()
        this.documentSetting = documentSetting;
        this.query = query;
        this.granularity = granularity;
        this.windowSizes = windowSizes;
        this.denseRetriever = denseRetriever;
        this.sparseRetriever = sparseRetriever;
        this.ranker = ranker;
        this.generator = generator;
    }
}
