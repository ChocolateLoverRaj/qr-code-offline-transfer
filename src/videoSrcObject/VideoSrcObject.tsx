import { useRef, type FC, useLayoutEffect, useEffect } from 'react'
import type Props from './Props'
import never from 'never'

const VideoSrcObject: FC<Props> = ({ srcObject, onStart }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useLayoutEffect(() => {
    const video = videoRef.current ?? never()
    video.srcObject = srcObject
    video.addEventListener('loadedmetadata', () => {
      void video.play()
    })
  }, [srcObject])

  useEffect(() => {
    const video = videoRef.current
    if (video !== null) onStart?.(video)
  }, [onStart])

  return (
    <video ref={videoRef} />
  )
}

export default VideoSrcObject
