import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from "react-router-dom";
import DocumentService from "../../services/DocumentService.ts";
import DocumentTypeService from "../../services/DocumentTypeService.ts";
import domainSlice, {DomainState} from "../../slices/DomainSlice.ts";
import {RootState} from "../../slices/Store.ts";
import {AuthenticationState} from "../../slices/AuthenticationSlice.ts";
import {useFormik} from "formik";
import SelectModalComponent from "../../components/long_form_qas/SelectModalComponent.tsx";
import DetailModalComponent from "../../components/managements/documents/DetailModalComponent.tsx";
import LongFormQaService from "../../services/LongFormQaService.ts";
import Content from "../../models/value_objects/contracts/Content.ts";
import QaResponse from "../../models/value_objects/contracts/response/long_form_qas/QaResponse.ts";
import QaRequest from "../../models/value_objects/contracts/requests/long_form_qas/QaRequest.ts";
import InputSetting from "../../models/value_objects/contracts/requests/long_form_qas/InputSetting.ts";
import DocumentSetting from "../../models/value_objects/contracts/requests/passage_searchs/DocumentSetting.ts";
import DenseRetriever from "../../models/value_objects/contracts/requests/passage_searchs/DenseRetriever.ts";
import SparseRetriever from "../../models/value_objects/contracts/requests/passage_searchs/SparseRetriever.ts";
import Ranker from "../../models/value_objects/contracts/requests/passage_searchs/Ranker.ts";
import Generator from "../../models/value_objects/contracts/requests/long_form_qas/Generator.ts";
import FileDocumentSetting from "../../models/value_objects/contracts/requests/passage_searchs/FileDocumentSetting.ts";
import TextDocumentSetting from "../../models/value_objects/contracts/requests/passage_searchs/TextDocumentSetting.ts";
import WebDocumentSetting from "../../models/value_objects/contracts/requests/passage_searchs/WebDocumentSetting.ts";
import DenseEmbeddingModel from "../../models/value_objects/contracts/requests/passage_searchs/DenseEmbeddingModel.ts";
import MultihopEmbeddingModel
    from "../../models/value_objects/contracts/requests/passage_searchs/MultihopEmbeddingModel.ts";
import OnlineEmbeddingModel
    from "../../models/value_objects/contracts/requests/passage_searchs/OnlineEmbeddingModel.ts";
import OnlineGeneratorModel from "../../models/value_objects/contracts/requests/long_form_qas/OnlineGeneratorModel.ts";
import processSlice, {ProcessState} from "../../slices/ProcessSlice.ts";


export default function LongFormQaPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const documentService = new DocumentService();
    const documentTypeService = new DocumentTypeService();
    const longFormQaService = new LongFormQaService();

    const processState: ProcessState = useSelector((state: RootState) => state.process);
    const domainState: DomainState = useSelector((state: RootState) => state.domain);
    const authenticationState: AuthenticationState = useSelector((state: RootState) => state.authentication);
    const {
        account
    } = authenticationState;

    const {
        isLoading
    } = processState;

    const {
        accountDocuments,
        documentTypes
    } = domainState.documentDomain;


    const {
        document,
        documentType,
        fileDocument,
        textDocument,
        webDocument,
        qaResponse,
        fileDocumentProperty,
    } = domainState.currentDomain;

    const {
        name,
        isShow
    } = domainState.modalDomain;


    const formik = useFormik({
        initialValues: {
            accountId: account?.id,
            inputSetting: {
                documentSetting: {
                    documentId: "",
                    detailSetting: {
                        startPage: 1,
                        endPage: 1,
                    }
                },
                query: "",
                granularity: "sentence",
                windowSizes: [
                    1, 2, 3, 4, 5
                ],
                denseRetriever: {
                    topK: 100,
                    similarityFunction: "dot_product",
                    sourceType: "dense_passage",
                    isUpdate: true,
                    embeddingModel: {
                        dimension: 128,
                        queryModel: "vblagoje/dpr-question_encoder-single-lfqa-wiki",
                        passageModel: "vblagoje/dpr-ctx_encoder-single-lfqa-wiki",
                        apiKey: "",
                        model: "sentence-transformers/all-mpnet-base-v2",
                        numIterations: 2,
                    }
                },
                sparseRetriever: {
                    topK: 100,
                    similarityFunction: "dot_product",
                    sourceType: "local",
                    model: "bm25"
                },
                ranker: {
                    sourceType: "sentence_transformers",
                    model: "naver/trecdl22-crossencoder-electra",
                    topK: 15
                },
                generator: {
                    sourceType: "online",
                    generatorModel: {
                        model: "gpt-3.5-turbo",
                        apiKey: ""
                    },
                    prompt:
                        "Synthesize a comprehensive answer from the following topk most relevant paragraphs and the given question.\n" +
                        "Provide an elaborated long answer from the key points and information in the paragraphs.\n" +
                        "Say irrelevant if the paragraphs are irrelevant to the question, then explain why it is irrelevant.\n" +
                        "Paragraphs: {join(documents)}\n" +
                        "Question: {query}\n" +
                        "Answer:",
                    answerMaxLength: 300
                }
            }
        },
        onSubmit: values => {
            dispatch(processSlice.actions.set({
                isLoading: true
            }));
            const qaRequest: QaRequest = getQaRequest(values);
            longFormQaService
                .qa(qaRequest)
                .then((response) => {
                    const content: Content<QaResponse> = response.data;
                    if (content.data) {
                        dispatch(domainSlice.actions.setCurrentDomain({
                            qaResponse: content.data,
                        }));
                    } else {
                        alert(content.message);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    dispatch(processSlice.actions.set({
                        isLoading: false
                    }));
                });
        }
    });


    useEffect(() => {
        formik.setFieldValue("inputSetting.documentSetting.detailSetting.endPage", fileDocumentProperty?.pageLength);
        formik.setFieldValue("inputSetting.documentSetting.documentId", document?.id);
        formik.setFieldValue("inputSetting.accountId", account?.id);
    }, [account, document, fileDocumentProperty]);

    const getQaRequest = (values: any): QaRequest => {
        let detailSetting: FileDocumentSetting | TextDocumentSetting | WebDocumentSetting | undefined = undefined
        if (documentType?.name === "file") {
            detailSetting = {
                startPage: values.inputSetting.documentSetting.detailSetting.startPage,
                endPage: values.inputSetting.documentSetting.detailSetting.endPage
            }
        } else if (documentType?.name === "text") {
            detailSetting = {}
        } else if (documentType?.name === "web") {
            detailSetting = {}
        } else {
            alert("Document type is not supported");
        }

        const documentSetting: DocumentSetting = {
            documentId: values.inputSetting.documentSetting.documentId,
            detailSetting: detailSetting
        }

        let embeddingModel: DenseEmbeddingModel | MultihopEmbeddingModel | OnlineEmbeddingModel | undefined = undefined;

        if (values.inputSetting.denseRetriever.sourceType == "dense_passage") {
            embeddingModel = {
                dimension: values.inputSetting.denseRetriever.embeddingModel.dimension,
                queryModel: values.inputSetting.denseRetriever.embeddingModel.queryModel,
                passageModel: values.inputSetting.denseRetriever.embeddingModel.passageModel,
            }
        } else if (values.inputSetting.denseRetriever.sourceType == "multihop") {
            embeddingModel = {
                dimension: values.inputSetting.denseRetriever.embeddingModel.dimension,
                model: values.inputSetting.denseRetriever.embeddingModel.model,
                num_iterations: values.inputSetting.denseRetriever.embeddingModel.numIterations,
            }
        } else if (values.inputSetting.denseRetriever.sourceType == "online") {
            embeddingModel = {
                dimension: values.inputSetting.denseRetriever.embeddingModel.dimension,
                model: values.inputSetting.denseRetriever.embeddingModel.model,
                apiKey: values.inputSetting.denseRetriever.embeddingModel.apiKey,
            }
        } else {
            throw new Error("Source type is not supported");
        }

        const denseRetriever: DenseRetriever = {
            topK: values.inputSetting.denseRetriever.topK,
            similarityFunction: values.inputSetting.denseRetriever.similarityFunction,
            sourceType: values.inputSetting.denseRetriever.sourceType,
            isUpdate: values.inputSetting.denseRetriever.isUpdate,
            embeddingModel: embeddingModel,
        }

        const sparseRetriever: SparseRetriever = {
            topK: values.inputSetting.sparseRetriever.topK,
            similarityFunction: values.inputSetting.sparseRetriever.similarityFunction,
            sourceType: values.inputSetting.sparseRetriever.sourceType,
            model: values.inputSetting.sparseRetriever.model
        }

        const ranker: Ranker = {
            sourceType: values.inputSetting.ranker.sourceType,
            model: values.inputSetting.ranker.model,
            topK: values.inputSetting.ranker.topK
        }

        let generatorModel: OnlineGeneratorModel | undefined = undefined;
        if (values.inputSetting.generator.sourceType == "online") {
            generatorModel = {
                model: values.inputSetting.generator.generatorModel.model,
                apiKey: values.inputSetting.generator.generatorModel.apiKey
            }
        } else {
            throw new Error("Source type is not supported");
        }

        const generator: Generator = {
            sourceType: values.inputSetting.generator.sourceType,
            generatorModel: generatorModel,
            prompt: values.inputSetting.generator.prompt,
            answerMaxLength: values.inputSetting.generator.answerMaxLength
        }

        const inputSetting: InputSetting = {
            documentSetting: documentSetting,
            query: values.inputSetting.query,
            granularity: values.inputSetting.granularity,
            windowSizes: values.inputSetting.windowSizes,
            denseRetriever: denseRetriever,
            sparseRetriever: sparseRetriever,
            ranker: ranker,
            generator: generator
        }

        return {
            accountId: values.accountId,
            inputSetting: inputSetting
        };
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            {name === "detail" && <DetailModalComponent/>}
            {name === "select" && <SelectModalComponent/>}
            <h1 className="my-5">Long Form Question Answering</h1>
            <h2 className="mb-4">Configuration</h2>
            <form onSubmit={formik.handleSubmit} className="d-flex flex-column w-50 mb-3">
                <h3 className="mb-2">Input Setting</h3>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.query">Query</label>
                    <textarea
                        id="inputSetting.query"
                        name="inputSetting.query"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting.query}
                    />
                </fieldset>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.granularity">Granularity</label>
                    <select
                        id="inputSetting.granularity"
                        name="inputSetting.granularity"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting.granularity}
                    >
                        <option value="word">Word</option>
                        <option selected value="sentence">Sentence</option>
                        <option value="paragraph">Paragraph</option>
                    </select>
                </fieldset>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.windowSizes">Window Sizes</label>
                    <input
                        type="text"
                        id="inputSetting.windowSizes"
                        name="inputSetting.windowSizes"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting.windowSizes.join(',')}
                    />
                </fieldset>
                <hr/>
                <h4 className="mb-2">Document Setting</h4>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.documentSetting.documentId">Document ID</label>
                    <input
                        type="text"
                        id="inputSetting.documentSetting.documentId"
                        name="inputSetting.documentSetting.documentId"
                        className="form-control"
                        placeholder="Select here.."
                        onClick={() => {
                            dispatch(domainSlice.actions.setModalDomain({
                                name: "select",
                                isShow: true
                            }));
                        }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting.documentSetting.documentId}
                    />
                </fieldset>
                <hr/>
                <h5 className="mb-2">Detail Setting</h5>
                {
                    {
                        "file":
                            <>
                                <fieldset className="mb-2">
                                    <label htmlFor="inputSetting.documentSetting.detailSetting.startPage">Start
                                        Page</label>
                                    <input
                                        type="number"
                                        id="inputSetting.documentSetting.detailSetting.startPage"
                                        name="inputSetting.documentSetting.detailSetting.startPage"
                                        className="form-control"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.inputSetting.documentSetting.detailSetting.startPage}
                                    />
                                </fieldset>
                                <fieldset className="mb-2">
                                    <label htmlFor="inputSetting.documentSetting.detailSetting.endPage">End Page</label>
                                    <input
                                        type="number"
                                        id="inputSetting.documentSetting.detailSetting.endPage"
                                        name="inputSetting.documentSetting.detailSetting.endPage"
                                        className="form-control"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.inputSetting.documentSetting.detailSetting.endPage}
                                    />
                                </fieldset>
                            </>,
                        "text": <div>None</div>,
                        "web": <div>None</div>,
                        "default": <div className="text-danger">Please select the supported document type.</div>
                    }[documentType?.name || "default"]
                }
                <hr/>
                <h4 className="mb-2">Dense Retriever</h4>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.denseRetriever.sourceType">Source Type</label>
                    <select
                        id="inputSetting.denseRetriever.sourceType"
                        name="inputSetting.denseRetriever.sourceType"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting.denseRetriever.sourceType}
                    >
                        <option selected value="dense_passage">Dense Passage</option>
                        <option value="multihop">Multihop</option>
                        <option value="online">Online</option>
                    </select>
                </fieldset>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.denseRetriever.similarityFunction">Similarity Function</label>
                    <select
                        id="inputSetting.denseRetriever.similarityFunction"
                        name="inputSetting.denseRetriever.similarityFunction"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting.denseRetriever.similarityFunction}
                    >
                        <option selected value="dot_product">Dot Product</option>
                        <option value="cosine">Cosine</option>
                    </select>
                </fieldset>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.denseRetriever.topK">Top K</label>
                    <input
                        type="number"
                        id="inputSetting.denseRetriever.topK"
                        name="inputSetting.denseRetriever.topK"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting.denseRetriever.topK}
                    />
                </fieldset>
                <fieldset className="mb-2 d-flex">
                    <input
                        type="checkbox"
                        id="inputSetting.denseRetriever.isUpdate"
                        name="inputSetting.denseRetriever.isUpdate"
                        className="form-check"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        checked={formik.values.inputSetting.denseRetriever.isUpdate}
                    />
                    <label htmlFor="inputSetting.denseRetriever.isUpdate" className="ms-2">Is update stored
                        embedding?</label>
                </fieldset>
                <hr/>
                <h5 className="mb-2">Embedding Model</h5>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.denseRetriever.embeddingModel.dimension">Dimension</label>
                    <input
                        type="number"
                        id="inputSetting.denseRetriever.embeddingModel.dimension"
                        name="inputSetting.denseRetriever.embeddingModel.dimension"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting.denseRetriever.embeddingModel.dimension}
                    />
                </fieldset>
                {{
                    "dense_passage":
                        <>
                            <fieldset className="mb-2">
                                <label htmlFor="inputSetting.denseRetriever.embeddingModel.queryModel">Query
                                    Model</label>
                                <input
                                    type="text"
                                    id="inputSetting.denseRetriever.embeddingModel.queryModel"
                                    name="inputSetting.denseRetriever.embeddingModel.queryModel"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.inputSetting.denseRetriever.embeddingModel.queryModel}
                                />
                            </fieldset>
                            <fieldset className="mb-2">
                                <label htmlFor="inputSetting.denseRetriever.embeddingModel.passageModel">Passage
                                    Model</label>
                                <input
                                    type="text"
                                    id="inputSetting.denseRetriever.embeddingModel.passageModel"
                                    name="inputSetting.denseRetriever.embeddingModel.passageModel"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.inputSetting.denseRetriever.embeddingModel.passageModel}
                                />
                            </fieldset>
                        </>,
                    "multihop":
                        <>
                            <fieldset className="mb-2">
                                <label htmlFor="inputSetting.denseRetriever.embeddingModel.model">Model</label>
                                <input
                                    type="text"
                                    id="inputSetting.denseRetriever.embeddingModel.model"
                                    name="inputSetting.denseRetriever.embeddingModel.model"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.inputSetting.denseRetriever.embeddingModel.model}
                                />
                            </fieldset>
                            <fieldset className="mb-2">
                                <label htmlFor="inputSetting.denseRetriever.embeddingModel.numIterations">Number of
                                    Iterations</label>
                                <input
                                    type="number"
                                    id="inputSetting.denseRetriever.embeddingModel.numIterations"
                                    name="inputSetting.denseRetriever.embeddingModel.numIterations"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.inputSetting.denseRetriever.embeddingModel.numIterations}
                                />
                            </fieldset>
                        </>,
                    "online": <>
                        <fieldset className="mb-2">
                            <label htmlFor="inputSetting.denseRetriever.embeddingModel.model">Model</label>
                            <input
                                type="text"
                                id="inputSetting.denseRetriever.embeddingModel.model"
                                name="inputSetting.denseRetriever.embeddingModel.model"
                                className="form-control"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.inputSetting.denseRetriever.embeddingModel.model}
                            />
                        </fieldset>
                        <fieldset className="mb-2">
                            <label htmlFor="inputSetting.denseRetriever.embeddingModel.apiKey">API Key</label>
                            <input
                                type="number"
                                id="inputSetting.denseRetriever.embeddingModel.apiKey"
                                name="inputSetting.denseRetriever.embeddingModel.apiKey"
                                className="form-control"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.inputSetting.denseRetriever.embeddingModel.apiKey}
                            />
                        </fieldset>
                    </>,
                    "default": <div className="text-danger">Please Select the supported embedding model.</div>
                }[formik.values.inputSetting.denseRetriever.sourceType || "default"]}
                <hr/>
                <h4 className="mb-2">Sparse Retriever</h4>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.sparseRetriever.sourceType">Source Type</label>
                    <select
                        id="inputSetting.sparseRetriever.sourceType"
                        name="inputSetting.sparseRetriever.sourceType"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting.sparseRetriever.sourceType}
                    >
                        <option selected value="local">Local</option>
                    </select>
                </fieldset>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.sparseRetriever.model">Model</label>
                    <select
                        id="inputSetting.sparseRetriever.model"
                        name="inputSetting.sparseRetriever.model"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting.sparseRetriever.model}
                    >
                        <option selected value="bm25">BM25</option>
                        <option value="tfidf">TFIDF</option>
                    </select>
                </fieldset>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.sparseRetriever.similarityFunction">Similarity Function</label>
                    <select
                        id="inputSetting.sparseRetriever.similarityFunction"
                        name="inputSetting.sparseRetriever.similarityFunction"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting.sparseRetriever.similarityFunction}
                    >
                        <option selected value="dot_product">Dot Product</option>
                        <option value="cosine">Cosine</option>
                    </select>
                </fieldset>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.sparseRetriever.top">Top K</label>
                    <input
                        type="number"
                        id="inputSetting.sparseRetriever.top"
                        name="inputSetting.sparseRetriever.topK"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting.sparseRetriever.topK}
                    />
                </fieldset>
                <hr/>
                <h4 className="mb-2">Ranker</h4>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.ranker.sourceType">Source Type</label>
                    <select
                        id="inputSetting.ranker.sourceType"
                        name="inputSetting.ranker.sourceType"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting.ranker.sourceType}
                    >
                        <option selected value="sentence_transformers">Sentence Transformers</option>
                    </select>
                </fieldset>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.ranker.model">Model</label>
                    <input
                        type="text"
                        id="inputSetting.ranker.model"
                        name="inputSetting.ranker.model"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting.ranker.model}
                    />
                </fieldset>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.ranker.topK">Top K</label>
                    <input
                        type="number"
                        id="inputSetting.ranker.topK"
                        name="inputSetting.ranker.topK"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting.ranker.topK}
                    />
                </fieldset>
                <hr/>
                <h4 className="mb-2">Generator</h4>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.generator.sourceType">Source Type</label>
                    <select
                        id="inputSetting.generator.sourceType"
                        name="inputSetting.generator.sourceType"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting.generator.sourceType}
                    >
                        <option selected value="online">Online</option>
                    </select>
                </fieldset>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.generator.answerMaxLength">Answer Max Length</label>
                    <input
                        type="number"
                        id="inputSetting.generator.answerMaxLength"
                        name="inputSetting.generator.answerMaxLength"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting.generator.answerMaxLength}
                    />
                </fieldset>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.generator.prompt">Prompt</label>
                    <textarea
                        id="inputSetting.generator.prompt"
                        name="inputSetting.generator.prompt"
                        className="form-control"
                        rows={9}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting.generator.prompt}
                    />
                </fieldset>
                <hr/>
                <h5 className="mb-2">Generator Model</h5>
                {
                    {
                        "online":
                            <>
                                <fieldset className="mb-2">
                                    <label htmlFor="inputSetting.generator.generatorModel.model">Model</label>
                                    <input
                                        type="text"
                                        id="inputSetting.generator.generatorModel.model"
                                        name="inputSetting.generator.generatorModel.model"
                                        className="form-control"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.inputSetting.generator.generatorModel.model}
                                    />
                                </fieldset>
                                <fieldset className="mb-2">
                                    <label htmlFor="inputSetting.generator.generatorModel.apiKey">API Key</label>
                                    <input
                                        type="password"
                                        id="inputSetting.generator.generatorModel.apiKey"
                                        name="inputSetting.generator.generatorModel.apiKey"
                                        className="form-control"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.inputSetting.generator.generatorModel.apiKey}
                                    />
                                </fieldset>
                            </>,
                        "default": <div className="text-danger">Please select the supported source type.</div>

                    }[formik.values.inputSetting.generator.sourceType || "default"]
                }
                <hr/>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {
                        isLoading ?
                            <div className="spinner-border text-light" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            :
                            "QA"
                    }
                </button>
            </form>
            <h2 className="mt-5 mb-4">Output</h2>
            <div className="d-flex flex-column justify-content-center align-items-center w-75">
                <h3>Process Duration</h3>
                <p className="text-center">
                    {qaResponse?.processDuration ? qaResponse?.processDuration + " second(s)." : "..."}
                </p>
            </div>
            <hr className="w-75 mb-3"/>
            <div className="d-flex flex-column justify-content-center align-items-center w-75">
                <h3>Answer</h3>
                <p style={{textAlign: "justify"}}>
                    {qaResponse?.generatedAnswer || "..."}
                </p>
            </div>
            <hr className="w-75 mb-3"/>
            <div className="d-flex flex-column justify-content-center align-items-center mb-5 w-75">
                <h3>Retrieved Documents</h3>
                <hr className="w-100"/>
                <table className="table table-hover" style={{tableLayout: "fixed"}}>
                    <thead>
                    <tr>
                        <th style={{"width": "5vw"}}>Rank</th>
                        <th style={{"width": "10vw"}}>Score</th>
                        <th style={{"width": "50vw"}}>Content</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        qaResponse?.retrievedDocuments ?
                            [...qaResponse.retrievedDocuments]
                                .sort((a, b) => b.score! - a.score!)
                                .map((document, index) => {
                                    return (
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td className="text-break">{document.score}</td>
                                            <td className="text-break">{document.content}</td>
                                        </tr>
                                    );
                                })
                            :
                            <tr>
                                <td>...</td>
                                <td>...</td>
                                <td>...</td>
                            </tr>
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
        ;
}

