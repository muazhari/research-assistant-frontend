import React from 'react';
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


export default function LongFormQaPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const documentService = new DocumentService();
    const documentTypeService = new DocumentTypeService();
    const longFormQaService = new LongFormQaService();

    const domainState: DomainState = useSelector((state: RootState) => state.domain);
    const authenticationState: AuthenticationState = useSelector((state: RootState) => state.authentication);
    const {account} = authenticationState;
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
        processDuration,
        generatedAnswer,
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
                    documentId: document?.id,
                    detailSetting: {
                        startPage: 1,
                        endPage: 1
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
                        numIterations: 0,
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
        enableReinitialize: true,
        onSubmit: values => {
            longFormQaService.qa({
                    accountId: values.accountId,
                    inputSetting: {
                        documentSetting: {
                            documentId: values.inputSetting.documentSetting.documentId,
                            detailSetting: {
                                startPage: values.inputSetting.documentSetting.detailSetting.startPage,
                                endPage: values.inputSetting.documentSetting.detailSetting.endPage
                            }
                        },
                        query: values.inputSetting.query,
                        granularity: values.inputSetting.granularity,
                        windowSizes: values.inputSetting.windowSizes,
                        denseRetriever: {
                            topK: values.inputSetting.denseRetriever.topK,
                            similarityFunction: values.inputSetting.denseRetriever.similarityFunction,
                            sourceType: values.inputSetting.denseRetriever.sourceType,
                            isUpdate: values.inputSetting.denseRetriever.isUpdate,
                            embeddingModel: {
                                dimension: values.inputSetting.denseRetriever.embeddingModel.dimension,
                                queryModel: values.inputSetting.denseRetriever.embeddingModel.queryModel,
                                passageModel: values.inputSetting.denseRetriever.embeddingModel.passageModel,
                            },
                        },
                        sparseRetriever: {
                            topK: values.inputSetting.sparseRetriever.topK,
                            similarityFunction: values.inputSetting.sparseRetriever.similarityFunction,
                            sourceType: values.inputSetting.sparseRetriever.sourceType,
                            model: values.inputSetting.sparseRetriever.model
                        },
                        ranker: {
                            sourceType: values.inputSetting.ranker.sourceType,
                            model: values.inputSetting.ranker.model,
                            topK: values.inputSetting.ranker.topK
                        },
                        generator: {
                            sourceType: values.inputSetting.generator.sourceType,
                            generatorModel: {
                                model: values.inputSetting.generator.generatorModel.model,
                                apiKey: values.inputSetting.generator.generatorModel.apiKey
                            },
                            prompt: values.inputSetting.generator.prompt,
                            answerMaxLength: values.inputSetting.generator.answerMaxLength
                        }
                    }
                }
            ).then((response) => {
                console.log(response)
                const content: Content<QaResponse> = response.data;
                if (content.data) {
                    dispatch(domainSlice.actions.setCurrentDomain({
                        processDuration: content.data?.processDuration,
                        generatedAnswer: content.data?.generatedAnswer,
                        retrievedDocuments: content.data?.retrievedDocuments
                    }));
                } else {
                    alert(content.message);
                }
            }).catch((error) => {
                console.log(error);
            })
        }
    });

    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            {name === "detail" && <DetailModalComponent/>}
            {name === "select" && <SelectModalComponent/>}
            <h1 className="my-5">Long Form Question Answering</h1>
            <h2 className="mb-3">Configuration</h2>
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
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.documentSetting.detailSetting.startPage">Start Page</label>
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
                    <label htmlFor="inputSetting.denseRetriever.isUpdate" className="ms-2">Is update embedding?</label>
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
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.denseRetriever.embeddingModel.queryModel">Query Model</label>
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
                    <label htmlFor="inputSetting.denseRetriever.embeddingModel.passageModel">Passage Model</label>
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
                <hr/>
                <button type="submit" className="btn btn-primary">QA</button>
            </form>
            <h2 className="my-3">Output</h2>
            <div className="d-flex flex-column justify-content-center align-items-center mb-3 w-50">
                <h3>Process Duration</h3>
                <hr className="w-100"/>
                <p>
                    {processDuration || "..."}
                </p>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center mb-5 w-50">
                <h3>Answer</h3>
                <hr className="w-100"/>
                {generatedAnswer || "..."}
            </div>
        </div>
    );
}

