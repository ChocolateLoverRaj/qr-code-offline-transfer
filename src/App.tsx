import { type FC } from 'react'
import Send from './Send'
import Receive from './Receive'

const App: FC = () => {
  return (
    <>
      <h1>Send</h1>
      <Send />
      <h1>Receive</h1>
      <Receive />
    </>
  )
}

export default App
