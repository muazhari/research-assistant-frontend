import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import domainSlice, { type DomainState } from '../../slices/DomainSlice.ts'
import { type RootState } from '../../slices/StoreConfiguration.ts'
import { useFormik } from 'formik'
import SelectModalComponent from '../../components/features/SelectModalComponent.tsx'
import DetailModalComponent from '../../components/managements/documents/DetailModalComponent.tsx'
import type Content from '../../models/dtos/contracts/Content.ts'
import type ProcessResponse from '../../models/dtos/contracts/response/long_form_qas/ProcessResponse.ts'
import { type Body } from '../../models/dtos/contracts/requests/long_form_qas/ProcessRequest.ts'
import processSlice, { type ProcessState } from '../../slices/ProcessSlice.ts'
import { longFormQaService } from '../../containers/ServiceContainer.ts'
import ReRankedDocumentModalComponent from '../../components/features/ReRankedDocumentModalComponent.tsx'
import { type ReRankedDocument } from '../../models/dtos/contracts/response/passage_searches/ProcessResponse.ts'
import FilePartitionStrategyConstant from '../../models/dtos/constants/FilePartitionStrategyConstant.ts'

export default function LongFormQaPage (): React.JSX.Element {
  const dispatch = useDispatch()

  const processState: ProcessState = useSelector((state: RootState) => state.process)
  const domainState: DomainState = useSelector((state: RootState) => state.domain)

  const {
    isLoading
  } = processState

  const {
    selectedDocuments,
    longFormQaProcessResponse
  } = domainState.currentDomain!

  const {
    name
  } = domainState.modalDomain!

  const [initialValues, setInitialValues] = useState<Body>({
    inputSetting: {
      documentIds: [],
      llmSetting: {
        modelName: 'claude-3-opus-20240229',
        maxToken: 500
      },
      preprocessorSetting: {
        filePartitionStrategy: FilePartitionStrategyConstant.AUTO,
        isIncludeImage: false,
        isIncludeTable: false,
        isForceRefreshCategorizedElement: false,
        chunkSize: 500,
        overlapSize: 50,
        isForceRefreshCategorizedDocument: false
      },
      question: '',
      embedderSetting: {
        modelName: 'BAAI/bge-m3',
        queryInstruction: 'Given the question, retrieve passage that answer the question.',
        isForceRefreshEmbedding: false,
        isForceRefreshDocument: false
      },
      retrieverSetting: {
        topK: 50,
        isForceRefreshRelevantDocument: false
      },
      rerankerSetting: {
        modelName: 'BAAI/bge-reranker-v2-m3',
        topK: 5,
        isForceRefreshReRankedDocument: false
      },
      transformQuestionMaxRetry: 3,
      generatorSetting: {
        prompt: `Instruction: Create a concise and informative answer for a given question based solely on the given passages. You must only use information from the given passages. Use an academic style. Do not repeat text. Cite at least one passage in each sentence. Cite the passages using passage number notation like "[number]". If multiple passages contain the answer, cite those passages like "[number, number, etc.]". If the passages do not contain the answer to the question, then say that answering is not possible given the available information with the explanation. Ensure the output does not re-explain the instruction.
Passages:
{% for passage in passages %}
[{{ loop.index }}]={{ passage.page_content }}
{% endfor %}
Question: {{ question }}
Answer:`,
        isForceRefreshGeneratedAnswer: false,
        isForceRefreshGeneratedQuestion: false,
        isForceRefreshGeneratedHallucinationGrade: false,
        isForceRefreshGeneratedAnswerRelevancyGrade: false
      }
    }
  })

  useEffect(() => {
    initialValues.inputSetting!.documentIds = selectedDocuments!.map((document) => document.id!)
    setInitialValues({
      ...initialValues
    })
  }, [selectedDocuments])

  const handleClickDetail = (reRankedDocument: ReRankedDocument): void => {
    dispatch(domainSlice.actions.setCurrentDomain({
      selectedReRankedDocument: reRankedDocument
    }))
    dispatch(domainSlice.actions.setModalDomain({
      name: 'reRankedDocument',
      isShow: true,
      source: 'reRankedDocument'
    }))
  }

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
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
            longFormQaProcessResponse: content.data!
          }))
        })
        .catch((error) => {
          console.error(error)
          alert(JSON.stringify(error.response.data, null, 2))
        })
        .finally(() => {
          dispatch(processSlice.actions.set({
            isLoading: false
          }))
        })
    }
  })

  return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            {name === 'reRankedDocument' && <ReRankedDocumentModalComponent/>}
            {name === 'detail' && <DetailModalComponent/>}
            {name === 'select' && <SelectModalComponent/>}
            <h1 className="my-5">Long Form Question Answering</h1>
            <h2 className="mb-4">Configuration</h2>
            <form className="d-flex flex-column w-50 mb-3">
                <h3 className="mb-2">Input Setting</h3>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.documentSetting.documentId">Document ID</label>
                    <textarea
                        id="inputSetting.documentSetting.documentId"
                        name="inputSetting.documentSetting.documentId"
                        className="form-control"
                        placeholder="Select here.."
                        onClick={() => {
                          dispatch(domainSlice.actions.setModalDomain({
                            name: 'select',
                            isShow: true,
                            source: 'selectDocumentId'
                          }))
                        }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting!.documentIds!.join(', ')}
                    />
                </fieldset>
                <hr/>
                <h4 className="mb-2">LLM Setting</h4>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.llmSetting.modelName">Model Name</label>
                    <input
                        type="text"
                        id="inputSetting.llmSetting.modelName"
                        name="inputSetting.llmSetting.modelName"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting!.llmSetting!.modelName}
                    />
                </fieldset>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.llmSetting.maxToken">Max Token</label>
                    <input
                        type="number"
                        id="inputSetting.llmSetting.maxToken"
                        name="inputSetting.llmSetting.maxToken"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting!.llmSetting!.maxToken}
                    />
                </fieldset>
                <hr/>
                <h4 className="mb-2">Preprocessor Setting</h4>
                <fieldset className="mb-2">
                    <label className="form-label" htmlFor="inputSetting.preprocessorSetting.filePartitionStrategy">
                        File Partition Strategy
                    </label>
                    <select
                        className="form-control"
                        name="inputSetting.preprocessorSetting.filePartitionStrategy"
                        id="inputSetting.preprocessorSetting.filePartitionStrategy"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.inputSetting!.preprocessorSetting!.filePartitionStrategy}
                    >
                        {
                            FilePartitionStrategyConstant.getValues().map((filePartitionStrategy: string) => {
                              return (
                                    <option
                                        key={filePartitionStrategy}
                                        value={filePartitionStrategy}
                                    >
                                        {filePartitionStrategy}
                                    </option>
                              )
                            })
                        }
                    </select>
                </fieldset>
                <fieldset className="mb-2 d-flex">
                    <input
                        type="checkbox"
                        id="inputSetting.preprocessorSetting.isForceRefreshCategorizedElement"
                        name="inputSetting.preprocessorSetting.isForceRefreshCategorizedElement"
                        className="form-check"
                        onChange={(event) => {
                          formik.handleChange(event)
                          if (event.target.checked) {
                            formik.setFieldValue('inputSetting.preprocessorSetting.isForceRefreshCategorizedDocument', true)
                            formik.setFieldValue('inputSetting.embedderSetting.isForceRefreshEmbedding', true)
                            formik.setFieldValue('inputSetting.embedderSetting.isForceRefreshDocument', true)
                            formik.setFieldValue('inputSetting.retrieverSetting.isForceRefreshRelevantDocument', true)
                            formik.setFieldValue('inputSetting.rerankerSetting.isForceRefreshReRankedDocument', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedAnswer', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedQuestion', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedHallucinationGrade', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedAnswerRelevancyGrade', true)
                          }
                        }}
                        onBlur={formik.handleBlur}
                        checked={formik.values.inputSetting!.preprocessorSetting!.isForceRefreshCategorizedElement}
                    />
                    <label htmlFor="inputSetting.preprocessorSetting.isForceRefreshCategorizedElement" className="ms-2">
                        Is Force Refresh Partitioned Document?
                    </label>
                </fieldset>
                <fieldset className="mb-2 d-flex">
                    <input
                        type="checkbox"
                        id="inputSetting.preprocessorSetting.isIncludeImage"
                        name="inputSetting.preprocessorSetting.isIncludeImage"
                        className="form-check"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        checked={formik.values.inputSetting!.preprocessorSetting!.isIncludeImage}
                    />
                    <label htmlFor="inputSetting.preprocessorSetting.isIncludeImage" className="ms-2">
                        Is Include Image?
                    </label>
                </fieldset>
                <fieldset className="mb-2 d-flex">
                    <input
                        type="checkbox"
                        id="inputSetting.preprocessorSetting.isIncludeTable"
                        name="inputSetting.preprocessorSetting.isIncludeTable"
                        className="form-check"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        checked={formik.values.inputSetting!.preprocessorSetting!.isIncludeTable}
                    />
                    <label htmlFor="inputSetting.preprocessorSetting.isIncludeTable" className="ms-2">
                        Is Include Table?
                    </label>
                </fieldset>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.preprocessorSetting.chunkSize">Chunk Size</label>
                    <input
                        type="number"
                        id="inputSetting.preprocessorSetting.chunkSize"
                        name="inputSetting.preprocessorSetting.chunkSize"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting!.preprocessorSetting!.chunkSize}
                    />
                </fieldset>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.preprocessorSetting.overlapSize">Overlap Size</label>
                    <input
                        type="number"
                        id="inputSetting.preprocessorSetting.overlapSize"
                        name="inputSetting.preprocessorSetting.overlapSize"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting!.preprocessorSetting!.overlapSize}
                    />
                </fieldset>
                <fieldset className="mb-2 d-flex">
                    <input
                        type="checkbox"
                        id="inputSetting.preprocessorSetting.isForceRefreshCategorizedDocument"
                        name="inputSetting.preprocessorSetting.isForceRefreshCategorizedDocument"
                        className="form-check"
                        onChange={(event) => {
                          formik.handleChange(event)
                          if (event.target.checked) {
                            formik.setFieldValue('inputSetting.embedderSetting.isForceRefreshEmbedding', true)
                            formik.setFieldValue('inputSetting.embedderSetting.isForceRefreshDocument', true)
                            formik.setFieldValue('inputSetting.retrieverSetting.isForceRefreshRelevantDocument', true)
                            formik.setFieldValue('inputSetting.rerankerSetting.isForceRefreshReRankedDocument', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedAnswer', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedQuestion', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedHallucinationGrade', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedAnswerRelevancyGrade', true)
                          }
                        }}
                        onBlur={formik.handleBlur}
                        checked={formik.values.inputSetting!.preprocessorSetting!.isForceRefreshCategorizedDocument}
                        disabled={formik.values.inputSetting!.preprocessorSetting!.isForceRefreshCategorizedElement}
                    />
                    <label htmlFor="inputSetting.preprocessorSetting.isForceRefreshCategorizedDocument"
                           className="ms-2">
                        Is Force Refresh Resized Document?
                    </label>
                </fieldset>
                <hr/>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.question">Question</label>
                    <textarea
                        id="inputSetting.question"
                        name="inputSetting.question"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting!.question}
                    />
                </fieldset>
                <hr/>
                <h4 className="mb-2">Embedder Setting</h4>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.embedderSetting.modelName">Model Name</label>
                    <input
                        type="text"
                        id="inputSetting.embedderSetting.modelName"
                        name="inputSetting.embedderSetting.modelName"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting!.embedderSetting!.modelName}
                    />
                </fieldset>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.embedderSetting.queryInstruction">Query Instruction</label>
                    <input
                        type="text"
                        id="inputSetting.embedderSetting.queryInstruction"
                        name="inputSetting.embedderSetting.queryInstruction"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting!.embedderSetting!.queryInstruction}
                    />
                </fieldset>
                <fieldset className="mb-2 d-flex">
                    <input
                        type="checkbox"
                        id="inputSetting.embedderSetting.isForceRefreshEmbedding"
                        name="inputSetting.embedderSetting.isForceRefreshEmbedding"
                        className="form-check"
                        onChange={(event) => {
                          formik.handleChange(event)
                          if (event.target.checked) {
                            formik.setFieldValue('inputSetting.retrieverSetting.isForceRefreshRelevantDocument', true)
                            formik.setFieldValue('inputSetting.rerankerSetting.isForceRefreshReRankedDocument', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedAnswer', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedQuestion', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedHallucinationGrade', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedAnswerRelevancyGrade', true)
                          }
                        }}
                        onBlur={formik.handleBlur}
                        checked={formik.values.inputSetting!.embedderSetting!.isForceRefreshEmbedding}
                        disabled={formik.values.inputSetting!.preprocessorSetting!.isForceRefreshCategorizedDocument}
                    />
                    <label htmlFor="inputSetting.embedderSetting.isForceRefreshEmbedding" className="ms-2">
                        Is Force Refresh Embedding?
                    </label>
                </fieldset>
                <fieldset className="mb-2 d-flex">
                    <input
                        type="checkbox"
                        id="inputSetting.embedderSetting.isForceRefreshDocument"
                        name="inputSetting.embedderSetting.isForceRefreshDocument"
                        className="form-check"
                        onChange={(event) => {
                          formik.handleChange(event)
                          if (event.target.checked) {
                            formik.setFieldValue('inputSetting.retrieverSetting.isForceRefreshRelevantDocument', true)
                            formik.setFieldValue('inputSetting.rerankerSetting.isForceRefreshReRankedDocument', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedAnswer', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedQuestion', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedHallucinationGrade', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedAnswerRelevancyGrade', true)
                          }
                        }}
                        onBlur={formik.handleBlur}
                        checked={formik.values.inputSetting!.embedderSetting!.isForceRefreshDocument}
                        disabled={formik.values.inputSetting!.preprocessorSetting!.isForceRefreshCategorizedDocument}
                    />
                    <label htmlFor="inputSetting.embedderSetting.isForceRefreshDocument" className="ms-2">
                        Is Force Refresh Preprocessed Document?
                    </label>
                </fieldset>
                <hr/>
                <h4 className="mb-2">Retriever Setting</h4>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.retrieverSetting.topK">Top K</label>
                    <input
                        type="number"
                        id="inputSetting.retrieverSetting.topK"
                        name="inputSetting.retrieverSetting.topK"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting!.retrieverSetting!.topK}
                    />
                </fieldset>
                <fieldset className="mb-2 d-flex">
                    <input
                        type="checkbox"
                        id="inputSetting.retrieverSetting.isForceRefreshRelevantDocument"
                        name="inputSetting.retrieverSetting.isForceRefreshRelevantDocument"
                        className="form-check"
                        onChange={(event) => {
                          formik.handleChange(event)
                          if (event.target.checked) {
                            formik.setFieldValue('inputSetting.rerankerSetting.isForceRefreshReRankedDocument', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedAnswer', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedQuestion', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedHallucinationGrade', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedAnswerRelevancyGrade', true)
                          }
                        }}
                        onBlur={formik.handleBlur}
                        checked={formik.values.inputSetting!.retrieverSetting!.isForceRefreshRelevantDocument}
                        disabled={
                            formik.values.inputSetting!.embedderSetting!.isForceRefreshEmbedding! ||
                            formik.values.inputSetting!.embedderSetting!.isForceRefreshDocument!
                        }
                    />
                    <label htmlFor="inputSetting.retrieverSetting.isForceRefreshRelevantDocument" className="ms-2">
                        Is Force Refresh Relevant Document?
                    </label>
                </fieldset>
                <hr/>
                <h4 className="mb-2">Re-Ranker Setting</h4>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.rerankerSetting.modelName">Model Name</label>
                    <input
                        type="text"
                        id="inputSetting.rerankerSetting.modelName"
                        name="inputSetting.rerankerSetting.modelName"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting!.rerankerSetting!.modelName}
                    />
                </fieldset>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.rerankerSetting.topK">Top K</label>
                    <input
                        type="number"
                        id="inputSetting.rerankerSetting.topK"
                        name="inputSetting.rerankerSetting.topK"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting!.rerankerSetting!.topK}
                    />
                </fieldset>
                <fieldset className="mb-2 d-flex">
                    <input
                        type="checkbox"
                        id="inputSetting.rerankerSetting.isForceRefreshReRankedDocument"
                        name="inputSetting.rerankerSetting.isForceRefreshReRankedDocument"
                        className="form-check"
                        onChange={(event) => {
                          formik.handleChange(event)
                          if (event.target.checked) {
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedAnswer', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedQuestion', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedHallucinationGrade', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedAnswerRelevancyGrade', true)
                          }
                        }}
                        onBlur={formik.handleBlur}
                        checked={formik.values.inputSetting!.rerankerSetting!.isForceRefreshReRankedDocument}
                        disabled={formik.values.inputSetting!.retrieverSetting!.isForceRefreshRelevantDocument}
                    />
                    <label htmlFor="inputSetting.rerankerSetting.isForceRefreshReRankedDocument" className="ms-2">
                        Is Force Refresh Re-Ranked Document?
                    </label>
                </fieldset>
                <hr/>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.transformQuestionMaxRetry">Transform Question Max Retry</label>
                    <input
                        type="number"
                        id="inputSetting.transformQuestionMaxRetry"
                        name="inputSetting.transformQuestionMaxRetry"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting!.transformQuestionMaxRetry}
                    />
                </fieldset>
                <hr/>
                <h4 className="mb-2">Generator Setting</h4>
                <fieldset className="mb-2">
                    <label htmlFor="inputSetting.generatorSetting.prompt">Prompt</label>
                    <textarea
                        rows={16}
                        id="inputSetting.generatorSetting.prompt"
                        name="inputSetting.generatorSetting.prompt"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.inputSetting!.generatorSetting!.prompt}
                    />
                </fieldset>
                <fieldset className="mb-2 d-flex">
                    <input
                        type="checkbox"
                        id="inputSetting.generatorSetting.isForceRefreshGeneratedAnswer"
                        name="inputSetting.generatorSetting.isForceRefreshGeneratedAnswer"
                        className="form-check"
                        onChange={(event) => {
                          formik.handleChange(event)
                          if (event.target.checked) {
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedQuestion', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedHallucinationGrade', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedAnswerRelevancyGrade', true)
                          }
                        }}
                        onBlur={formik.handleBlur}
                        checked={formik.values.inputSetting!.generatorSetting!.isForceRefreshGeneratedAnswer}
                        disabled={formik.values.inputSetting!.rerankerSetting!.isForceRefreshReRankedDocument}
                    />
                    <label htmlFor="inputSetting.generatorSetting.isForceRefreshGeneratedAnswer" className="ms-2">
                        Is Force Refresh Generated Answer?
                    </label>
                </fieldset>
                <fieldset className="mb-2 d-flex">
                    <input
                        type="checkbox"
                        id="inputSetting.generatorSetting.isForceRefreshGeneratedQuestion"
                        name="inputSetting.generatorSetting.isForceRefreshGeneratedQuestion"
                        className="form-check"
                        onChange={(event) => {
                          formik.handleChange(event)
                          if (event.target.checked) {
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedHallucinationGrade', true)
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedAnswerRelevancyGrade', true)
                          }
                        }}
                        onBlur={formik.handleBlur}
                        checked={formik.values.inputSetting!.generatorSetting!.isForceRefreshGeneratedQuestion}
                        disabled={formik.values.inputSetting!.generatorSetting!.isForceRefreshGeneratedAnswer}
                    />
                    <label htmlFor="inputSetting.generatorSetting.isForceRefreshGeneratedQuestion" className="ms-2">
                        Is Force Refresh Generated Question?
                    </label>
                </fieldset>
                <fieldset className="mb-2 d-flex">
                    <input
                        type="checkbox"
                        id="inputSetting.generatorSetting.isForceRefreshGeneratedHallucinationGrade"
                        name="inputSetting.generatorSetting.isForceRefreshGeneratedHallucinationGrade"
                        className="form-check"
                        onChange={(event) => {
                          formik.handleChange(event)
                          if (event.target.checked) {
                            formik.setFieldValue('inputSetting.generatorSetting.isForceRefreshGeneratedAnswerRelevancyGrade', true)
                          }
                        }}
                        onBlur={formik.handleBlur}
                        checked={formik.values.inputSetting!.generatorSetting!.isForceRefreshGeneratedHallucinationGrade}
                        disabled={formik.values.inputSetting!.generatorSetting!.isForceRefreshGeneratedQuestion}
                    />
                    <label htmlFor="inputSetting.generatorSetting.isForceRefreshGeneratedHallucinationGrade"
                           className="ms-2">
                        Is Force Refresh Generated Hallucination Grade?
                    </label>
                </fieldset>
                <fieldset className="mb-2 d-flex">
                    <input
                        type="checkbox"
                        id="inputSetting.generatorSetting.isForceRefreshGeneratedAnswerRelevancyGrade"
                        name="inputSetting.generatorSetting.isForceRefreshGeneratedAnswerRelevancyGrade"
                        className="form-check"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        checked={formik.values.inputSetting!.generatorSetting!.isForceRefreshGeneratedAnswerRelevancyGrade}
                        disabled={formik.values.inputSetting!.generatorSetting!.isForceRefreshGeneratedHallucinationGrade}
                    />
                    <label htmlFor="inputSetting.generatorSetting.isForceRefreshGeneratedAnswerRelevancyGrade"
                           className="ms-2">
                        Is Force Refresh Generated Answer Relevancy Grade?
                    </label>
                </fieldset>
                <hr/>
                <button onClick={formik.submitForm} type="submit" className="btn btn-primary" disabled={isLoading}>
                    {
                        isLoading!
                          ? <div className="spinner-border text-light" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                          : 'Process'
                    }
                </button>
            </form>
            <h2 className="text-center mb-4 mt-5">Output</h2>
            <div className="d-flex flex-column justify-content-center align-items-center w-75">
                <h3 className="text-center">Process Duration</h3>
                <p className="text-center">
                    {
                        longFormQaProcessResponse !== undefined
                          ? (new Date(longFormQaProcessResponse.finishedAt!).getTime() - new Date(longFormQaProcessResponse.startedAt!).getTime()) / 1000 + ' second(s).'
                          : '...'
                    }
                </p>
            </div>
            <hr className="w-75 mb-3"/>
            <div className="d-flex flex-column justify-content-center align-items-center w-75">
                <h3 className="text-center">Grades</h3>
                {longFormQaProcessResponse?.hallucinationGrade !== undefined &&
                longFormQaProcessResponse?.answerRelevancyGrade !== undefined
                  ? (
                        <>
                            <fieldset className="mb-2 d-flex">
                                <input
                                    type="checkbox"
                                    id="hallucinationGrade"
                                    name="hallucinationGrade"
                                    className="form-check"
                                    checked={longFormQaProcessResponse.hallucinationGrade}
                                    disabled={true}
                                />
                                <label htmlFor="hallucinationGrade" className="ms-2">
                                    Retrieved Passage - Answer Hallucination Grade
                                </label>
                            </fieldset>
                            <fieldset className="mb-2 d-flex">

                                <input
                                    type="checkbox"
                                    id="relevancyGrade"
                                    name="relevancyGrade"
                                    className="form-check"
                                    checked={longFormQaProcessResponse.answerRelevancyGrade}
                                    disabled={true}
                                />
                                <label htmlFor="relevancyGrade" className="ms-2">
                                    Question - Answer Relevancy Grade
                                </label>
                            </fieldset>
                        </>
                    )
                  : '...'
                }
            </div>
            <hr className="w-75 mb-3"/>
            <div className="d-flex flex-column justify-content-center align-items-center w-75">
                <h3 className="text-center">Answer</h3>
                <p style={{ textAlign: 'justify' }}>
                    {longFormQaProcessResponse?.generatedAnswer ?? '...'}
                </p>
            </div>
            <hr className="w-75 mb-3"/>
            <div className="d-flex flex-column justify-content-center align-items-center w-75 mb-5">
                <h3 className="text-center">Retrieved Passages</h3>
                <hr className="w-100"/>
                <table className="table-hover table" style={{ tableLayout: 'fixed' }}>
                    <thead>
                    <tr>
                        <th style={{ width: '5vw' }}>Rank</th>
                        <th style={{ width: '5vw' }}>Score</th>
                        <th style={{ width: '50vw' }}>Content</th>
                        <th style={{ width: '10vw' }}>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        longFormQaProcessResponse !== undefined
                          ? longFormQaProcessResponse.reRankedDocuments!
                            .map((reRankedDocument, index) => {
                              return (
                                        <tr
                                            key={index}
                                        >
                                            <td>{index + 1}</td>
                                            <td className="text-break">{reRankedDocument.metadata!.reRankedScore!}</td>
                                            <td className="text-break"
                                                style={{ textAlign: 'justify' }}>{reRankedDocument.pageContent!}</td>
                                            <td>
                                                <button
                                                    className="btn btn-success"
                                                    onClick={() => {
                                                      handleClickDetail(reRankedDocument)
                                                    }}
                                                >
                                                    Detail
                                                </button>
                                            </td>
                                        </tr>
                              )
                            })
                          : <tr>
                                <td>...</td>
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
