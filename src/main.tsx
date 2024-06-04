import React from 'react'
import ReactDOM from 'react-dom/client'
import ManageRegistryApp from './ManageRegistryApp.js'
import './styles/output.css'

const root = document.getElementById('root');
if (root != null) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ManageRegistryApp />
    </React.StrictMode>,
  )
}
