import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Admin from './Admin.tsx'
import './index.css'

// Simple routing based on pathname
const isAdminRoute = window.location.pathname === '/admin';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isAdminRoute ? <Admin /> : <App />}
  </React.StrictMode>,
)
