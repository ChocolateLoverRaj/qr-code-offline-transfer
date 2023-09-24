import { useEffect, type FC, useState } from 'react'
import VideoSrcObject from './videoSrcObject/VideoSrcObject'
import { BarcodeDetector } from 'barcode-detector'
import never from 'never'
import { LoopyLoop } from 'loopyloop'
import DownloadLink from './downloadLink/DownloadLink'

interface TransferState {
  page: number
  totalPages: number
  chunks: ArrayBuffer[]
}

const ReceiveModal: FC = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream>()
  const [barcodeDetector] = useState(new BarcodeDetector({ formats: ['qr_code'] }))
  const [video, setVideo] = useState<HTMLVideoElement>()
  const [transferState, setTransferState] = useState<TransferState>()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment'
      }
    }).then(mediaStream => {
      setMediaStream(mediaStream)
    })
  }, [])

  useEffect(() => {
    return () => {
      mediaStream?.getTracks().forEach(track => {
        track.stop()
      })
    }
  }, [mediaStream])

  useEffect(() => {
    if (video !== undefined && mediaStream !== undefined) {
      const settings = mediaStream.getVideoTracks()[0].getSettings()
      const width = settings.width ?? never()
      const height = settings.height ?? never()
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d') ?? never()

      const loopyLoop = new LoopyLoop(async () => {
        ctx.drawImage(video, 0, 0, width, height)
        void barcodeDetector.detect(canvas).then(([detectedBarcode]) => {
          if (detectedBarcode !== undefined) {
            const textEncoder = new TextEncoder()
            const arrayBuffer = textEncoder.encode(detectedBarcode.rawValue).buffer
            setTransferState(transferState => {
              if (transferState === undefined) {
                const metaData = new Int32Array(arrayBuffer, 0, 2)
                const page = metaData[0]
                const totalPages = metaData[1]
                const data = arrayBuffer.slice(8)
                const td = new TextDecoder()
                let string = ''; const decoder = new TextDecoder()
                string += decoder.decode(data)
                string += decoder.decode() // end-of-queue
                alert(string)
                if (page === 0) {
                  return {
                    page,
                    totalPages,
                    chunks: [data]
                  }
                } else {
                  return transferState
                }
              } else {
                const metaData = new Int32Array(arrayBuffer, 0, 1)
                const page = metaData[0]
                const data = arrayBuffer.slice(4)
                if (page === transferState.page + 1) {
                  return {
                    ...transferState,
                    chunks: [
                      ...transferState.chunks,
                      data
                    ],
                    page
                  }
                } else {
                  return transferState
                }
              }
            })
          }
        })
      })
      loopyLoop.start()
      return () => {
        loopyLoop.stop()
      }
    }
  }, [barcodeDetector, mediaStream, video])

  return (
    <>
      {mediaStream !== undefined
        ? (
          <>
            {transferState !== undefined
              ? (
                <>
                  <button
                    onClick={() => {
                      setTransferState(undefined)
                    }}
                  >
                    Cancel
                  </button><br />
                  Page {transferState.page + 1}/{transferState.totalPages}<br />
                  {transferState.chunks
                    .map(chunk => chunk.byteLength)
                    .reduce((total, n) => total + n, 0)} bytes transferred<br />
                  {transferState.page + 1 === transferState.totalPages
                    ? (
                      <>
                        Done transferring!<br />
                        <DownloadLink
                          chunks={transferState.chunks}
                          fileName='file.png'
                        >
                          Click here to download file
                        </DownloadLink>
                      </>
                      )
                    : (
                      <VideoSrcObject
                        srcObject={mediaStream}
                        onStart={setVideo}
                      />
                      )}
                </>
                )
              : (
                <>
                  Scan a (special) QR Code to start data transfer
                  <VideoSrcObject
                    srcObject={mediaStream}
                    onStart={setVideo}
                  />
                </>)}

          </>
          )
        : 'Getting Camera'}
    </>
  )
}

export default ReceiveModal
