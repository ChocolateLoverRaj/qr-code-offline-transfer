import { useState, type FC, useEffect } from 'react'
import type Props from './Props'
import QrCode from '../qr-code/QrCode'

const errorCorrectionLevels = ['L', 'M', 'Q', 'H'] as const
type ErrorCorrectionLevel = typeof errorCorrectionLevels[number]

const maxLengths: Record<ErrorCorrectionLevel, number> = {
  L: 2953,
  M: 2331,
  Q: 1663,
  H: 1273
}

const QrCodes: FC<Props> = ({ file }) => {
  const [result, setResult] = useState<ArrayBuffer>()
  const [page, setPage] = useState(0)
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<ErrorCorrectionLevel>('L')

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    file.arrayBuffer().then((arrayBuffer) => {
      setResult(arrayBuffer)
    })
  }, [file])

  return (
    <>
      Name: {file.name} <br />
      <label>
        Error correction level:{' '}
        <select
          value={errorCorrectionLevel}
          onChange={({ target: { value } }) => {
            setErrorCorrectionLevel(value as ErrorCorrectionLevel)
          }}
        >
          {errorCorrectionLevels.map(value => (
            <option key={value} value={value} label={value} />
          ))}
        </select>
      </label>
      <br />
      {result !== undefined
        ? (() => {
            const maxLength = maxLengths[errorCorrectionLevel]
            const metaDataSizeFirstChunk = 8
            const metaDataSizeNextChunks = 4
            // Leave space for 2 x 64 bit integers
            const dataLengthFirstChunk = maxLength - metaDataSizeFirstChunk
            const dataLengthPerNextChunk = maxLength - metaDataSizeNextChunks
            const chunks = Math.ceil(1 + Math.max((result.byteLength - maxLength) / dataLengthPerNextChunk, 0))

            const qrCodeData = new ArrayBuffer(4 + (page === 0 ? 4 : 0) + (page === 0 ? Math.min(result.byteLength, dataLengthFirstChunk) : Math.min(result.byteLength - dataLengthFirstChunk - (page - 1) * dataLengthPerNextChunk, dataLengthPerNextChunk)))
            const metaData = new Int32Array(qrCodeData, 0, page === 0 ? 2 : 1)
            metaData[0] = page
            if (page === 0) {
              metaData[1] = chunks
            }
            const data = new Uint8Array(qrCodeData, page === 0 ? metaDataSizeFirstChunk : metaDataSizeNextChunks)
            const sliceStart = dataLengthFirstChunk * Number(Boolean(page)) + dataLengthPerNextChunk * Math.max(page - 1, 0)
            const sliceEnd = sliceStart + (page === 0 ? dataLengthFirstChunk : dataLengthPerNextChunk)
            console.log(page === 0 ? metaDataSizeFirstChunk : metaDataSizeNextChunks, data.length, sliceStart, sliceEnd, page === 0 ? dataLengthFirstChunk : dataLengthPerNextChunk, qrCodeData.byteLength)
            console.log({
              dataSliceLength: result.slice(sliceStart, sliceEnd).byteLength,
              destinationLength: data.byteLength
            })
            data.set(new Uint8Array(result.slice(sliceStart, sliceEnd)))

            return (
              <>
                Page {page + 1} of {chunks} <br />
                <QrCode
                  value={new Uint8Array(qrCodeData)}
                  errorCorrectionLevel={errorCorrectionLevel}
                  margin={0}
                />
                <br />
                <button
                  onClick={() => {
                    setPage(page => page - 1)
                  }}
                  disabled={page === 0}
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    setPage(page => page + 1)
                  }}
                  disabled={page + 1 >= Math.ceil(result.byteLength / maxLength)}
                >
                  Next
                </button>
              </>
            )
          })()
        : 'Creating QR Code'}
      <br />

    </>
  )
}

export default QrCodes
