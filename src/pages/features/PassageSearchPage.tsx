import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import domainSlice, { type DomainState } from '../../slices/DomainSlice.ts'
import { type RootState } from '../../slices/StoreConfiguration.ts'
import { useFormik } from 'formik'
import SelectModalComponent from '../../components/features/SelectModalComponent.tsx'
import DetailModalComponent from '../../components/managements/documents/DetailModalComponent.tsx'
import type Content from '../../models/dtos/contracts/Content.ts'
import type ProcessResponse from '../../models/dtos/contracts/response/passage_searches/ProcessResponse.ts'
import { type ReRankedDocument } from '../../models/dtos/contracts/response/passage_searches/ProcessResponse.ts'
import { type Body } from '../../models/dtos/contracts/requests/passage_searches/ProcessRequest.ts'
import processSlice, { type ProcessState } from '../../slices/ProcessSlice.ts'
import { documentService, passageSearchService } from '../../containers/ServiceContainer.ts'
import ReRankedDocumentModalComponent from '../../components/features/ReRankedDocumentModalComponent.tsx'
import type Document from '../../models/daos/Document.ts'
import FilePartitionStrategyConstant from '../../models/dtos/constants/FilePartitionStrategyConstant.ts'

export default function PassageSearchPage (): React.JSX.Element {
  const dispatch = useDispatch()

  const processState: ProcessState = useSelector((state: RootState) => state.process)
  const domainState: DomainState = useSelector((state: RootState) => state.domain)

  const {
    isLoading
  } = processState

  const {
    selectedDocuments,
    passageSearchProcessResponse
  } = domainState.currentDomain!

  const {
    name
  } = domainState.modalDomain!

  const [initialValues] = useState<Body>({
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
      }
    }
  })

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

  const handleClickDocumentId = (documentId: string): void => {
    dispatch(processSlice.actions.set({
      isLoading: true
    }))
    documentService
      .findOneById({
        id: documentId
      })
      .then((response) => {
        const content: Content<Document> = response.data
        dispatch(domainSlice.actions.setCurrentDomain({
          selectedDocument: content.data!
        }))
        dispatch(domainSlice.actions.setModalDomain({
          name: 'detail',
          isShow: true,
          source: 'documentDetail'
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

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: values => {
      dispatch(processSlice.actions.set({
        isLoading: true
      }))
      passageSearchService
        .process({
          body: values
        })
        .then((response) => {
          const content: Content<ProcessResponse> = response.data
          dispatch(domainSlice.actions.setCurrentDomain({
            passageSearchProcessResponse: content.data!
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

  useEffect(() => {
    formik.setFieldValue('inputSetting.documentIds', selectedDocuments!.map((document) => document.id!))
  }, [selectedDocuments])

  return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            {name === 'reRankedDocument' && <ReRankedDocumentModalComponent/>}
            {name === 'detail' && <DetailModalComponent/>}
            {name === 'select' && <SelectModalComponent/>}
            <h1 className="my-5">Passage Search</h1>
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
                        readOnly={true}
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
                        disabled={true}
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
                        disabled={true}
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
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        checked={formik.values.inputSetting!.rerankerSetting!.isForceRefreshReRankedDocument}
                        disabled={formik.values.inputSetting!.retrieverSetting!.isForceRefreshRelevantDocument}
                    />
                    <label htmlFor="inputSetting.rerankerSetting.isForceRefreshReRankedDocument" className="ms-2">
                        Is Force Refresh Re-Ranked Document?
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
                        passageSearchProcessResponse !== undefined
                          ? (new Date(passageSearchProcessResponse.finishedAt!).getTime() - new Date(passageSearchProcessResponse.startedAt!).getTime()) / 1000 + ' second(s).'
                          : '...'
                    }
                </p>
            </div>
            <hr className="w-75 mb-3"/>
            <div className="d-flex flex-column justify-content-center align-items-center w-75">
                <h3 className="text-center mb-3">Marked Documents</h3>
                {
                    passageSearchProcessResponse !== undefined
                      ? passageSearchProcessResponse.finalDocumentUrls!.map((finalDocumentUrl, index) => {
                        return (
                                <div
                                    className="d-flex flex-column justify-content-center align-items-center mb-3 w-100"
                                    key={index}
                                >
                                    <button
                                        className="btn btn-success w-100 rounded-0"
                                        onClick={() => {
                                          handleClickDocumentId(formik.values.inputSetting!.documentIds![index])
                                        }}
                                    >
                                        {formik.values.inputSetting!.documentIds![index]}
                                    </button>
                                    <embed
                                        style={{
                                          width: '100%',
                                          height: '100vh'
                                        }}
                                        src={finalDocumentUrl}
                                    />
                                </div>

                        )
                      })
                      : '...'
                }
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
                        passageSearchProcessResponse !== undefined
                          ? passageSearchProcessResponse.reRankedDocuments!
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
