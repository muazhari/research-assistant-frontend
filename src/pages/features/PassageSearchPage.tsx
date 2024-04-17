import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DocumentTypeService from '../../services/DocumentTypeService.ts'
import domainSlice, { type DomainState } from '../../slices/DomainSlice.ts'
import { type RootState } from '../../slices/StoreConfiguration.ts'
import { type AuthenticationState } from '../../slices/AuthenticationSlice.ts'
import { useFormik } from 'formik'
import SelectModalComponent from '../../components/features/SelectModalComponent.tsx'
import DetailModalComponent from '../../components/managements/documents/DetailModalComponent.tsx'
import type Content from '../../models/dtos/contracts/Content.ts'
import type InputSetting from '../../models/dtos/contracts/requests/passage_searches/InputSetting.ts'
import type DocumentSetting from '../../models/dtos/contracts/requests/basic_settings/DocumentSetting.ts'
import type DenseRetriever from '../../models/dtos/contracts/requests/basic_settings/DenseRetriever.ts'
import type SparseRetriever from '../../models/dtos/contracts/requests/basic_settings/SparseRetriever.ts'
import type Ranker from '../../models/dtos/contracts/requests/basic_settings/Ranker.ts'
import type FileDocumentSetting from '../../models/dtos/contracts/requests/basic_settings/FileDocumentSetting.ts'
import type TextDocumentSetting from '../../models/dtos/contracts/requests/basic_settings/TextDocumentSetting.ts'
import type WebDocumentSetting from '../../models/dtos/contracts/requests/basic_settings/WebDocumentSetting.ts'
import type DenseEmbeddingModel from '../../models/dtos/contracts/requests/basic_settings/DenseEmbeddingModel.ts'
import type MultihopEmbeddingModel from '../../models/dtos/contracts/requests/basic_settings/MultihopEmbeddingModel.ts'
import type OnlineEmbeddingModel from '../../models/dtos/contracts/requests/basic_settings/OnlineEmbeddingModel.ts'
import type ProcessRequest from '../../models/dtos/contracts/requests/passage_searches/ProcessRequest.ts'
import type OutputSetting from '../../models/dtos/contracts/requests/basic_settings/OutputSeting.ts'
import PassageSearchService from '../../services/PassageSearchService.ts'
import type ProcessResponse from '../../models/dtos/contracts/response/passage_searchs/ProcessResponse.ts'
import type DocumentType from '../../models/daos/DocumentType.ts'
import processSlice, { type ProcessState } from '../../slices/ProcessSlice.ts'
import b64toBlob from 'b64-to-blob'
import type FileDocument from '../../models/daos/FileDocument.ts'
import type SentenceTransformersRankerModel
  from '../../models/dtos/contracts/requests/basic_settings/SentenceTransformersRankerModel.ts'
import type OnlineRankerModel from '../../models/dtos/contracts/requests/basic_settings/OnlineRankerModel.ts'
import type QuerySetting from '../../models/dtos/contracts/requests/basic_settings/QuerySetting.ts'
import type HydeSetting from '../../models/dtos/contracts/requests/basic_settings/HydeSetting.ts'
import type Generator from '../../models/dtos/contracts/requests/basic_settings/Generator.ts'

export default function PassageSearchPage (): React.JSX.Element {
  const dispatch = useDispatch()

  const documentTypeService = new DocumentTypeService()
  const passageSearchService = new PassageSearchService()

  const domainState: DomainState = useSelector((state: RootState) => state.domain)
  const processState: ProcessState = useSelector((state: RootState) => state.process)
  const authenticationState: AuthenticationState = useSelector((state: RootState) => state.authentication)
  const { account } = authenticationState
  const {
    documentTypes
  } = domainState.documentDomain!

  const {
    document,
    documentType,
    searchProcess,
    fileDocumentProperty
  } = domainState.currentDomain!

  const {
    isLoading
  } = processState

  const {
    name
  } = domainState.modalDomain!

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const getEnglishTemplate = () => {
    return {
      accountId: account!.id,
      inputSetting: {
        query: '',
        granularity: 'sentence',
        windowSizes: '1,3,6',
        querySetting: {
          prefix: 'Represent this sentence for searching relevant passages: ',
          hydeSetting: {
            isUse: true,
            generator: {
              sourceType: 'online',
              generatorModel: {
                model: 'gpt-4',
                apiKey: ''
              },
              prompt:
                                'Question: {query}\n' +
                                'Answer:',
              answerMaxLength: 100
            }
          }
        },
        documentSetting: {
          documentId: document!.id,
          detailSetting: {
            startPage: 1,
            endPage: fileDocumentProperty!.pageLength
          },
          prefix: ''
        },
        denseRetriever: {
          topK: 100,
          similarityFunction: 'dot_product',
          sourceType: 'multihop',
          isRefresh: true,
          embeddingModel: {
            dimension: 1024,
            queryModel: 'vblagoje/dpr-question_encoder-single-lfqa-wiki',
            passageModel: 'vblagoje/dpr-ctx_encoder-single-lfqa-wiki',
            apiKey: '',
            model: 'BAAI/bge-large-en-v1.5',
            numIterations: 1
          }
        },
        sparseRetriever: {
          topK: 100,
          similarityFunction: 'dot_product',
          sourceType: 'local',
          isRefresh: true,
          model: 'bm25'
        },
        ranker: {
          sourceType: 'sentence_transformers',
          rankerModel: {
            model: 'BAAI/bge-reranker-large',
            apiKey: ''
          },
          topK: 15
        }
      },
      outputSetting: {
        documentTypeId: documentTypes!.find((documentType) => documentType.name === 'file')!.id
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const getMultilingualTemplate = () => {
    return {
      accountId: account!.id,
      inputSetting: {
        query: '',
        granularity: 'sentence',
        windowSizes: '1,3,6',
        querySetting: {
          prefix: 'query: ',
          hydeSetting: {
            isUse: true,
            generator: {
              sourceType: 'online',
              generatorModel: {
                model: 'gpt-4',
                apiKey: ''
              },
              prompt:
                                'Question: {query}\n' +
                                'Answer:',
              answerMaxLength: 100
            }
          }
        },
        documentSetting: {
          documentId: document!.id,
          detailSetting: {
            startPage: 1,
            endPage: fileDocumentProperty!.pageLength
          },
          prefix: 'passage: '
        },
        denseRetriever: {
          topK: 100,
          similarityFunction: 'dot_product',
          sourceType: 'multihop',
          isRefresh: true,
          embeddingModel: {
            dimension: 1024,
            queryModel: 'voidful/dpr-question_encoder-bert-base-multilingual',
            passageModel: 'voidful/dpr-ctx_encoder-bert-base-multilingual',
            apiKey: '',
            model: 'intfloat/multilingual-e5-large',
            numIterations: 1
          }
        },
        sparseRetriever: {
          topK: 100,
          similarityFunction: 'dot_product',
          sourceType: 'local',
          isRefresh: true,
          model: 'bm25'
        },
        ranker: {
          sourceType: 'sentence_transformers',
          rankerModel: {
            model: 'intfloat/multilingual-e5-large',
            apiKey: ''
          },
          topK: 15
        }
      },
      outputSetting: {
        documentTypeId: documentTypes!.find((documentType) => documentType.name === 'file')!.id
      }
    }
  }

  const formik = useFormik({
    initialValues: getEnglishTemplate(),
    enableReinitialize: false,
    onSubmit: values => {
      dispatch(processSlice.actions.set({
        isLoading: true
      }))
      const searchRequest: ProcessRequest = getSearchRequest(values)
      passageSearchService
        .search(searchRequest)
        .then((response) => {
          const content: Content<ProcessResponse> = response.data
          if (response.status === 200) {
            dispatch(domainSlice.actions.setCurrentDomain({
              searchResponse: content.data
            }))
          } else {
            alert(content.message)
          }
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

  const fetchData = (): void => {
    documentTypeService
      .findMany()
      .then((response) => {
        const content: Content<DocumentType[]> = response.data
        dispatch(domainSlice.actions.setDocumentDomain({
          documentTypes: content.data!
        }))
      })
      .catch((error) => {
        console.error(error)
      })
  }

  useEffect(() => {
    if (documentTypes!.length === 0) {
      fetchData()
    }

    const setter = async (): Promise<void> => {
      await formik.setFieldValue('inputSetting.documentSetting.detailSetting.endPage', fileDocumentProperty!.pageLength)
      await formik.setFieldValue('inputSetting.documentSetting.documentId', document!.id)
      await formik.setFieldValue('inputSetting.accountId', account!.id)
      await formik.setFieldValue('outputSetting.documentTypeId', documentTypes!.find((documentType) => documentType.name === 'file')!.id)
    }
    setter()
      .then()
      .catch((error) => {
        console.error(error)
      })
  }, [account, document, fileDocumentProperty, documentTypes])

  const getSearchRequest = (values: any): ProcessRequest => {
    const hydeGenerator: Generator = {
      sourceType: values.inputSetting.querySetting.hydeSetting.generator.sourceType,
      generatorModel: values.inputSetting.querySetting.hydeSetting.generator.generatorModel,
      prompt: values.inputSetting.querySetting.hydeSetting.generator.prompt,
      answerMaxLength: values.inputSetting.querySetting.hydeSetting.generator.answerMaxLength
    }
    const hydeSetting: HydeSetting = {
      isUse: values.inputSetting.querySetting.hydeSetting.isUse,
      generator: hydeGenerator
    }
    const querySetting: QuerySetting = {
      prefix: values.inputSetting.querySetting.prefix,
      hydeSetting
    }

    let detailSetting: FileDocumentSetting | TextDocumentSetting | WebDocumentSetting | undefined
    if (documentType!.name === 'file') {
      detailSetting = {
        startPage: values.inputSetting.documentSetting.detailSetting.startPage,
        endPage: values.inputSetting.documentSetting.detailSetting.endPage
      }
    } else if (documentType!.name === 'text') {
      detailSetting = {}
    } else if (documentType!.name === 'web') {
      detailSetting = {}
    } else {
      alert('Document type is not supported.')
    }

    const documentSetting: DocumentSetting = {
      documentId: values.inputSetting.documentSetting.documentId,
      detailSetting,
      prefix: values.inputSetting.documentSetting.prefix
    }

    let embeddingModel: DenseEmbeddingModel | MultihopEmbeddingModel | OnlineEmbeddingModel | undefined
    if (values.inputSetting.denseRetriever.sourceType === 'dense_passage') {
      embeddingModel = {
        dimension: values.inputSetting.denseRetriever.embeddingModel.dimension,
        queryModel: values.inputSetting.denseRetriever.embeddingModel.queryModel,
        passageModel: values.inputSetting.denseRetriever.embeddingModel.passageModel
      }
    } else if (values.inputSetting.denseRetriever.sourceType === 'multihop') {
      embeddingModel = {
        dimension: values.inputSetting.denseRetriever.embeddingModel.dimension,
        model: values.inputSetting.denseRetriever.embeddingModel.model,
        num_iterations: values.inputSetting.denseRetriever.embeddingModel.numIterations
      }
    } else if (values.inputSetting.denseRetriever.sourceType === 'online') {
      embeddingModel = {
        dimension: values.inputSetting.denseRetriever.embeddingModel.dimension,
        model: values.inputSetting.denseRetriever.embeddingModel.model,
        apiKey: values.inputSetting.denseRetriever.embeddingModel.apiKey
      }
    } else {
      alert('Source type is not supported.')
    }

    const denseRetriever: DenseRetriever = {
      topK: values.inputSetting.denseRetriever.topK,
      similarityFunction: values.inputSetting.denseRetriever.similarityFunction,
      sourceType: values.inputSetting.denseRetriever.sourceType,
      isRefresh: values.inputSetting.denseRetriever.isRefresh,
      embeddingModel
    }

    const sparseRetriever: SparseRetriever = {
      topK: values.inputSetting.sparseRetriever.topK,
      similarityFunction: values.inputSetting.sparseRetriever.similarityFunction,
      sourceType: values.inputSetting.sparseRetriever.sourceType,
      isRefresh: values.inputSetting.sparseRetriever.isRefresh,
      model: values.inputSetting.sparseRetriever.model
    }

    let rankerModel: SentenceTransformersRankerModel | OnlineRankerModel | undefined
    if (values.inputSetting.ranker.sourceType === 'sentence_transformers') {
      rankerModel = {
        model: values.inputSetting.ranker.rankerModel.model
      }
    } else if (values.inputSetting.ranker.sourceType === 'online') {
      rankerModel = {
        model: values.inputSetting.ranker.rankerModel.model,
        apiKey: values.inputSetting.ranker.rankerModel.apiKey
      }
    }

    const ranker: Ranker = {
      sourceType: values.inputSetting.ranker.sourceType,
      rankerModel,
      topK: values.inputSetting.ranker.topK
    }

    const inputSetting: InputSetting = {
      query: values.inputSetting.query,
      granularity: values.inputSetting.granularity,
      windowSizes: values.inputSetting.windowSizes.split(',').map((value: string) => value.trim()).map((value: string) => parseInt(value)),
      querySetting,
      documentSetting,
      denseRetriever,
      sparseRetriever,
      ranker
    }

    const outputSetting: OutputSetting = {
      documentTypeId: values.outputSetting.documentTypeId
    }

    return {
      accountId: values.accountId,
      inputSetting,
      outputSetting
    }
  }

  const base64PdfToBlobUrl = (base64: string): string => {
    const blob = b64toBlob(base64, 'application/pdf')
    return URL.createObjectURL(blob)
  }

  const handleClickTemplate = async (template: string): Promise<void> => {
    if (template === 'english') {
      await formik.setValues(getEnglishTemplate())
      alert('English template is set!')
    } else if (template === 'multilingual') {
      await formik.setValues(getMultilingualTemplate())
      alert('Multilingual template is set!')
    } else {
      alert('Template is not supported.')
    }
  }

  return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            {name === 'detail' && <DetailModalComponent/>}
            {name === 'select' && <SelectModalComponent/>}
            <h1 className="my-5">Passage Search</h1>
            <h2 className="mb-4">Configuration</h2>
            <div className="d-flex flex-column w-50">
                <h3 className="mb-2">Template</h3>
                <div className="d-flex mb-3">
                    <button
                        type="button" className="btn btn-outline-primary me-3"
                        onClick={async () => { await handleClickTemplate('english') }}>
                        English
                    </button>
                    <button
                        type="button" className="btn btn-outline-primary"
                        onClick={async () => { await handleClickTemplate('multilingual') }}>
                        Multilingual
                    </button>
                </div>
            </div>
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
                <h3 className="mb-2">Output Setting</h3>
                <fieldset className="mb-2">
                    <label htmlFor="outputSetting.documentTypeId">Document Type</label>
                    <select
                        disabled
                        id="outputSetting.documentTypeId"
                        name="outputSetting.documentTypeId"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.outputSetting.documentTypeId}
                    >
                        {
                            documentTypes!.map(documentType => {
                              return <option key={documentType.id} value={documentType.id}>
                                    {documentType.name}
                                </option>
                            })
                        }
                    </select>
                </fieldset>
                <hr/>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {
                        isLoading
                          ? <div className="spinner-border text-light" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                          : 'Search'
                    }
                </button>
            </form>
            <h2 className="mb-4 mt-5">Output</h2>
            <div className="d-flex flex-column justify-content-center align-items-center w-75">
                <h3>Process Duration</h3>
                <p className="text-center">
                    {searchProcess!.processDuration === undefined ? searchProcess!.processDuration + ' second(s).' : '...'}
                </p>
            </div>
            <hr className="w-75 mb-3"/>
            <div className="d-flex flex-column justify-content-center align-items-center w-75">
                <h3>Highlighted Document</h3>
                {
                    searchProcess!.outputDocument !== undefined
                      ? <embed
                            style={{ width: '100%', height: '100vh' }}
                            src={base64PdfToBlobUrl((searchProcess!.outputDocument as FileDocument).fileBytes)}
                        />
                      : '...'
                }
            </div>
            <hr className="w-75 mb-3"/>
            <div className="d-flex flex-column justify-content-center align-items-center w-75 mb-5">
                <h3>Retrieved Documents</h3>
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
                        searchProcess!.retrievedDocuments !== undefined
                          ? [...searchProcess!.retrievedDocuments]
                              .sort((a, b) => b.score! - a.score!)
                              .map((document, index) => {
                                return (
                                        <tr key={index}>
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
