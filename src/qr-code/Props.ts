import { type QRCodeErrorCorrectionLevel } from 'qrcode'

interface Props {
  value: Uint8Array
  errorCorrectionLevel: QRCodeErrorCorrectionLevel
  margin?: number
}

export default Props
