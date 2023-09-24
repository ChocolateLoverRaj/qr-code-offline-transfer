import { useRef, type FC, useLayoutEffect } from 'react'
import type Props from './Props'
import qrcode from 'qrcode'
import never from 'never'

const QrCode: FC<Props> = ({ value, errorCorrectionLevel, margin }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useLayoutEffect(() => {
    qrcode.toCanvas(canvasRef.current ?? never(), [{
      mode: 'byte',
      data: value
    }], {
      errorCorrectionLevel,
      margin
    })
      .then(() => {
        'Done'
      })
      .catch((e) => {
        throw e
      })
  }, [value])

  return (
    <>
      <canvas ref={canvasRef} />
    </>
  )
}

export default QrCode
