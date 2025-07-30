import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './style.css' // ملف ستايل موحد لو عايز

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
