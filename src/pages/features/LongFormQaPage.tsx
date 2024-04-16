import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import domainSlice, { type DomainState } from '../../slices/DomainSlice.ts'
import { type RootState } from '../../slices/Store.ts'
import { type AuthenticationState } from '../../slices/AuthenticationSlice.ts'
import { useFormik } from 'formik'
import SelectModalComponent from '../../components/features/SelectModalComponent.tsx'
import DetailModalComponent from '../../components/managements/documents/DetailModalComponent.tsx'
import LongFormQaService from '../../services/LongFormQaService.ts'
import type Content from '../../models/dtos/contracts/Content.ts'
import type ProcessResponse from '../../models/dtos/contracts/response/longForm_qas/ProcessResponse.ts'
import type ProcessRequest from '../../models/dtos/contracts/requests/longForm_qas/ProcessRequest.ts'
import type InputSetting from '../../models/dtos/contracts/requests/longForm_qas/InputSetting.ts'
import type DocumentSetting from '../../models/dtos/contracts/requests/basic_settings/DocumentSetting.ts'
import type DenseRetriever from '../../models/dtos/contracts/requests/basic_settings/DenseRetriever.ts'
import type SparseRetriever from '../../models/dtos/contracts/requests/basic_settings/SparseRetriever.ts'
import type Ranker from '../../models/dtos/contracts/requests/basic_settings/Ranker.ts'
import type Generator from '../../models/dtos/contracts/requests/basic_settings/Generator.ts'
import type FileDocumentSetting from '../../models/dtos/contracts/requests/basic_settings/FileDocumentSetting.ts'
import type TextDocumentSetting from '../../models/dtos/contracts/requests/basic_settings/TextDocumentSetting.ts'
import type WebDocumentSetting from '../../models/dtos/contracts/requests/basic_settings/WebDocumentSetting.ts'
import type DenseEmbeddingModel from '../../models/dtos/contracts/requests/basic_settings/DenseEmbeddingModel.ts'
import type MultihopEmbeddingModel from '../../models/dtos/contracts/requests/basic_settings/MultihopEmbeddingModel.ts'
import type OnlineEmbeddingModel from '../../models/dtos/contracts/requests/basic_settings/OnlineEmbeddingModel.ts'
import type OnlineGeneratorModel from '../../models/dtos/contracts/requests/basic_settings/OnlineGeneratorModel.ts'
import processSlice, { type ProcessState } from '../../slices/ProcessSlice.ts'
import type SentenceTransformersRankerModel
  from '../../models/dtos/contracts/requests/basic_settings/SentenceTransformersRankerModel.ts'
import type OnlineRankerModel from '../../models/dtos/contracts/requests/basic_settings/OnlineRankerModel.ts'
import type QuerySetting from '../../models/dtos/contracts/requests/basic_settings/QuerySetting.ts'
import type HydeSetting from '../../models/dtos/contracts/requests/basic_settings/HydeSetting.ts'

export default function LongFormQaPage (): React.JSX.Element {
  const dispatch = useDispatch()

  const longFormQaService = new LongFormQaService()

  const processState: ProcessState = useSelector((state: RootState) => state.process)
  const domainState: DomainState = useSelector((state: RootState) => state.domain)
  const authenticationState: AuthenticationState = useSelector((state: RootState) => state.authentication)
  const {
    account
  } = authenticationState

  const {
    isLoading
  } = processState

  const {
    document,
    documentType,
    qaProcess,
    fileDocumentProperty
  } = domainState.currentDomain!

  const {
    name
  } = domainState.modalDomain!

  const getInitialValues = (): InputSetting => {
    return {
      documentIds: [],
      llmSetting: {
        modelName: 'claude-3-haiku-20240307',
        maxToken: 500
      },
      preprocessorSetting: {
        isForceRefreshCategorizedElement: false,
        isForceRefreshCategorizedDocument: false,
        chunkSize: 500,
        overlapSize: 50
      },
      embedderSetting: {
        isForceRefresh_embedding: false,
        isForceRefresh_document: false,
        modelName: 'BAAI/bge-m3',
        queryInstruction: 'Given the question, retrieve passage that answer the question.'
      },
      retriever_setting: {
        isForceRefreshRelevant_document: false,
        topK: 50
      },
      reranker_setting: {
        isForceRefreshReRanked_document: false,
        modelName: 'BAAI/bge-reranker-v2-m3',
        topK: 5
      },
      question: '',
      generator_setting: {
        isForceRefreshGenerated_answer: false,
        isForceRefreshGenerated_question: false,
        isForceRefreshGeneratedHallucinationGrade: false,
        isForceRefreshGenerated_answerRelevancyGrade: false,
        prompt: `Instruction: Create a concise and informative answer for a given question based solely on the given passages. You must only use information from the given passages. Use an unbiased and journalistic tone. Do not repeat text. Cite at least one passage in each sentence. Cite the passages using passage number notation like "[number]". If multiple passages contain the answer, cite those passages like "[number, number, etc.]". If the passages do not contain the answer to the question, then say that answering is not possible given the available information with the explanation. Ensure the output is only the answer without re-explain the instruction.
        Passages:
        {% for passage in passages %}
        [{{ loop.index }}]={{ passage.page_content }}
        {% endfor %}
        Question: {{ question }}
        Answer:`
      },
      transformQuestionMaxRetry: 3
    }
  }

  const formik = useFormik({
    initialValues: getInitialValues(),
    enableReinitialize: false,
    onSubmit: values => {
      dispatch(processSlice.actions.set({
        isLoading: true
      }))
      longFormQaService
        .process({
          body: values
        })
        .then((response) => {
          const content: Content<ProcessResponse> = response.data
          dispatch(domainSlice.actions.setCurrentDomain({
            qaResponse: content.data
          }))
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          dispatch(processSlice.actions.set({
            isLoading: false
          }))
        })
    }
  })

  useEffect(() => {
    formik.setFieldValue('inputSetting.documentSetting.documentId', document!.id)
    formik.setFieldValue('inputSetting.accountId', account!.id)
    formik.setFieldValue('inputSetting.documentSetting.detailSetting.endPage', fileDocumentProperty!.pageLength)
  }, [account, document, fileDocumentProperty])

  return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            {name === 'detail' && <DetailModalComponent/>}
            {name === 'select' && <SelectModalComponent/>}
            <h1 className="my-5">Long Form Question Answering</h1>
            <h2 className="mb-4">Configuration</h2>
            <form onSubmit={formik.handleSubmit} className="d-flex flex-column w-50 mb-3">
                <h3 className="mb-2">Input Setting</h3>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.query">Query</label>
                    <textarea
                        rows={5}
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
                        value={formik.values.inputSetting.windowSizes}
                    />
                </fieldset>
                <hr/>
                <h4 className="mb-2">Query Setting</h4>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.querySetting.prefix">Prefix</label>
                    <input
                        type="text"
                        id="inputSetting.querySetting.prefix"
                        name="inputSetting.querySetting.prefix"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting.querySetting.prefix}
                    />
                </fieldset>
                <hr/>
                <h5 className="mb-2">Hyde Setting</h5>
                <fieldset className="d-flex mb-2">
                    <input
                        type="checkbox"
                        id="inputSetting.querySetting.hydeSetting.isUse"
                        name="inputSetting.querySetting.hydeSetting.isUse"
                        className="form-check"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        checked={formik.values.inputSetting.querySetting.hydeSetting.isUse}
                    />
                    <label htmlFor="inputSetting.querySetting.hydeSetting.isUse" className="ms-2">
                        Is use?
                    </label>
                </fieldset>
                {
                    formik.values.inputSetting.querySetting.hydeSetting.isUse &&
                    <>
                        <hr/>
                        <h6 className="mb-2">Generator</h6>
                        <fieldset className="mb-2">
                            <label htmlFor="inputSetting.querySetting.hydeSetting.generator.sourceType">Source Type</label>
                            <select
                                id="inputSetting.querySetting.hydeSetting.generator.sourceType"
                                name="inputSetting.querySetting.hydeSetting.generator.sourceType"
                                className="form-control"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.inputSetting.querySetting.hydeSetting.generator.sourceType}
                            >
                                <option selected value="online">Online</option>
                            </select>
                        </fieldset>
                        <fieldset className="mb-2">
                            <label htmlFor="inputSetting.querySetting.hydeSetting.generator.answerMaxLength">Answer Max Length</label>
                            <input
                                type="number"
                                id="inputSetting.querySetting.hydeSetting.generator.answerMaxLength"
                                name="inputSetting.querySetting.hydeSetting.generator.answerMaxLength"
                                className="form-control"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.inputSetting.querySetting.hydeSetting.generator.answerMaxLength}
                            />
                        </fieldset>
                        <fieldset className="mb-2">
                            <label htmlFor="inputSetting.querySetting.hydeSetting.generator.prompt">Prompt</label>
                            <textarea
                                id="inputSetting.querySetting.hydeSetting.generator.prompt"
                                name="inputSetting.querySetting.hydeSetting.generator.prompt"
                                className="form-control"
                                rows={2}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.inputSetting.querySetting.hydeSetting.generator.prompt}
                            />
                        </fieldset>
                        <hr/>
                        <h6 className="mb-2">Generator Model</h6>
                        {
                            {
                              online:
                                    <>
                                        <fieldset className="mb-2">
                                            <label htmlFor="inputSetting.querySetting.hydeSetting.generator.generatorModel.model">Model</label>
                                            <input
                                                type="text"
                                                id="inputSetting.querySetting.hydeSetting.generator.generatorModel.model"
                                                name="inputSetting.querySetting.hydeSetting.generator.generatorModel.model"
                                                className="form-control"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.inputSetting.querySetting.hydeSetting.generator.generatorModel.model}
                                            />
                                        </fieldset>
                                        <fieldset className="mb-2">
                                            <label htmlFor="inputSetting.querySetting.hydeSetting.generator.generatorModel.apiKey">API Key</label>
                                            <input
                                                type="password"
                                                id="inputSetting.querySetting.hydeSetting.generator.generatorModel.apiKey"
                                                name="inputSetting.querySetting.hydeSetting.generator.generatorModel.apiKey"
                                                className="form-control"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.inputSetting.querySetting.hydeSetting.generator.generatorModel.apiKey}
                                            />
                                        </fieldset>
                                    </>
                            }[formik.values.inputSetting.querySetting.hydeSetting.generator.sourceType]
                        }
                    </>
                }
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
                            name: 'select',
                            isShow: true
                          }))
                        }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting.documentSetting.documentId}
                    />
                    <label htmlFor="inputSetting.documentSetting.prefix">Prefix</label>
                    <input
                        type="text"
                        id="inputSetting.documentSetting.prefix"
                        name="inputSetting.documentSetting.prefix"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting.documentSetting.prefix}
                    />
                </fieldset>
                <hr/>
                <h5 className="mb-2">Detail Setting</h5>
                {
                    {
                      file:
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
                      text: <div>None</div>,
                      web: <div>None</div>
                    }[documentType!.name!]
                }
                <hr/>
                <h4 className="mb-2">Dense Retriever</h4>
                <fieldset className="d-flex mb-2">
                    <input
                        type="checkbox"
                        id="inputSetting.denseRetriever.isRefresh"
                        name="inputSetting.denseRetriever.isRefresh"
                        className="form-check"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        checked={formik.values.inputSetting.denseRetriever.isRefresh}
                    />
                    <label htmlFor="inputSetting.denseRetriever.isRefresh" className="ms-2">
                        is refresh stored data?
                    </label>
                </fieldset>
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
                  dense_passage:
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
                  multihop:
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
                  online: <>
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
                    </>
                }[formik.values.inputSetting.denseRetriever.sourceType]}
                <hr/>
                <h4 className="mb-2">Sparse Retriever</h4>
                <fieldset className="d-flex mb-2">
                    <input
                        type="checkbox"
                        id="inputSetting.sparseRetriever.isRefresh"
                        name="inputSetting.sparseRetriever.isRefresh"
                        className="form-check"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        checked={formik.values.inputSetting.sparseRetriever.isRefresh}
                    />
                    <label htmlFor="inputSetting.sparseRetriever.isRefresh" className="ms-2">
                        is refresh stored data?
                    </label>
                </fieldset>
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
                        <option value="online">Online</option>
                    </select>
                </fieldset>
                {{
                  sentence_transformers:
                        <>
                            <fieldset className="mb-2">
                                <label htmlFor="inputSetting.ranker.rankerModel.model">Model</label>
                                <input
                                    type="text"
                                    id="inputSetting.ranker.rankerModel.model"
                                    name="inputSetting.ranker.rankerModel.model"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.inputSetting.ranker.rankerModel.model}
                                />
                            </fieldset>
                        </>,
                  online: <>
                        <fieldset className="mb-2">
                            <label htmlFor="inputSetting.ranker.rankerModel.model">Model</label>
                            <input
                                type="text"
                                id="inputSetting.ranker.rankerModel.model"
                                name="inputSetting.ranker.rankerModel.model"
                                className="form-control"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.inputSetting.ranker.rankerModel.model}
                            />
                        </fieldset>
                        <fieldset className="mb-2">
                            <label htmlFor="inputSetting.denseRetriever.embeddingModel.apiKey">API Key</label>
                            <input
                                type="number"
                                id="inputSetting.ranker.rankerModel.apiKey"
                                name="inputSetting.ranker.rankerModel.apiKey"
                                className="form-control"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.inputSetting.ranker.rankerModel.apiKey}
                            />
                        </fieldset>
                    </>
                }[formik.values.inputSetting.ranker.sourceType]}
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
                      online:
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
                            </>
                    }[formik.values.inputSetting.generator.sourceType]
                }
                <hr/>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {
                        isLoading!
                          ? <div className="spinner-border text-light" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                          : 'QA'
                    }
                </button>
            </form>
            <h2 className="mb-4 mt-5">Output</h2>
            <div className="d-flex flex-column justify-content-center align-items-center w-75">
                <h3>Process Duration</h3>
                <p className="text-center">
                    {qaProcess!.processDuration === undefined ? qaProcess!.processDuration + ' second(s).' : '...'}
                </p>
            </div>
            <hr className="w-75 mb-3"/>
            <div className="d-flex flex-column justify-content-center align-items-center w-75">
                <h3>Answer</h3>
                <p style={{ textAlign: 'justify' }}>
                    {qaProcess!.generatedAnswer ?? '...'}
                </p>
            </div>
            <hr className="w-75 mb-3"/>
            <div className="d-flex flex-column justify-content-center align-items-center w-75 mb-5">
                <h3>Retrieved Documents</h3>
                <hr className="w-100"/>
                <table className="table-hover table" style={{ tableLayout: 'fixed' }}>
                    <thead>
                    <tr>
                        <th style={{ width: '5vw' }}>Rank</th>
                        <th style={{ width: '10vw' }}>Score</th>
                        <th style={{ width: '50vw' }}>Content</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        qaProcess!.retrievedDocuments !== undefined
                          ? [...qaProcess!.retrievedDocuments]
                              .sort((a, b) => b.score! - a.score!)
                              .map((document, index) => {
                                return (
                                        <tr
                                        key={index}
                                        >
                                            <td>{index + 1}</td>
                                            <td className="text-break">{document.score}</td>
                                            <td className="text-break">{document.content}</td>
                                        </tr>
                                )
                              })
                          : <tr>
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
}
