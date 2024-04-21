import { Modal, ModalBody, ModalHeader } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import domainSlice, { type DomainState } from '../../slices/DomainSlice.ts'
import { type RootState } from '../../slices/StoreConfiguration.ts'
import React, { useEffect } from 'react'
import JsonView from '@uiw/react-json-view'

export default function ReRankedDocumentModalComponent (): React.JSX.Element {
  const dispatch = useDispatch()

  const domainState: DomainState = useSelector((state: RootState) => state.domain)

  const {
    selectedReRankedDocument
  } = domainState.currentDomain!

  const {
    isShow
  } = domainState.modalDomain!

  const handleOnHide = (): void => {
    dispatch(domainSlice.actions.setModalDomain({
      isShow: false
    }))
  }

  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  useEffect(() => {
    window.addEventListener('resize', () => {
      if (window.innerWidth < 768) {
        setIsMobile(true)
      } else {
        setIsMobile(false)
      }
    })
  }, [])

  return (
        <Modal
            size='lg'
            show={isShow}
            onHide={handleOnHide}
        >
            <ModalHeader closeButton>
                <Modal.Title>Detail</Modal.Title>
            </ModalHeader>
            <ModalBody>
                <JsonView
                    style={{ fontSize: isMobile ? 'calc(2.5 * ((1vh + 1vw)/2))' : 'calc(1.5 * ((1vh + 1vw)/2))' }}
                    value={selectedReRankedDocument ?? {}}
                    collapsed={5}
                    shortenTextAfterLength={0}
                    displayDataTypes={false}
                    displayObjectSize={false}
                    enableClipboard={false}
                />
            </ModalBody>
        </Modal>
  )
}
