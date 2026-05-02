import './styles/tokens.css'
import './styles/global.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

console.log("MAIN LOADED");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)