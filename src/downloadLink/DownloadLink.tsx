import { useState, type FC, useLayoutEffect } from 'react'
import type Props from './Props'

const DownloadLink: FC<Props> = ({ fileName, chunks, children }) => {
  const [url, setUrl] = useState<string>()

  useLayoutEffect(() => {
    const objectUrl = URL.createObjectURL(new Blob(chunks))
    setUrl(objectUrl)
    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [chunks])

  return (
    <a href={url} download={fileName}>{children}</a>
  )
}

export default DownloadLink
