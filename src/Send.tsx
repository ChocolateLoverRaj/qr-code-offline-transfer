import { type FC, useState } from 'react'
import Modal from 'react-modal'
import QrCodes from './qr-codes/QrCodes'

const Send: FC = () => {
  const [input, setInput] = useState<HTMLInputElement>()
  const [showModal, setShowModal] = useState(false)

  const files = input?.files ?? undefined

  return (
    <>
      <label>
        Choose a file to share <br />
        <input
          type='file'
          onChange={({ target }) => { setInput(target) }}
        />
      </label>
      {files !== undefined && files.length > 1 && 'Only 1 file supported'}
      <br />
      <button
        disabled={files?.length !== 1}
        onClick={() => { setShowModal(true) }}
      >
        Generate QR Code
      </button>
      <Modal
        isOpen={showModal}
        onRequestClose={() => {
          setShowModal(false)
        }}
        ariaHideApp={false}

      >
        {input?.files?.[0] !== undefined && <QrCodes file={input.files[0]} />}
      </Modal>
    </>
  )
}

export default Send
