import { useState, type FC } from 'react'
import Modal from 'react-modal'
import ReceiveModal from './ReceiveModal'

const Receive: FC = () => {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        onClick={() => {
          setShowModal(true)
        }}
      >
        Start receiving
      </button>
      <Modal
        isOpen={showModal}
        onRequestClose={() => {
          setShowModal(false)
        }}
        ariaHideApp={false}
      >
        <ReceiveModal />
      </Modal>
    </>
  )
}

export default Receive
