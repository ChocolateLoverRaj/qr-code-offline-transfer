import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import never from 'never'
import setImmediate from 'set-immediate-shim'

window.setImmediate = setImmediate

ReactDOM.createRoot(document.getElementById('root') ?? never()).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
