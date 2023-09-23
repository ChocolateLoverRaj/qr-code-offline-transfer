import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import never from 'never'

ReactDOM.createRoot(document.getElementById('root') ?? never()).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
