import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { clientData } from './data/clientData.js'
import { applyTheme, applyFavicon } from './utils/theme.js'
import { validateConfig } from './utils/validateConfig.js'
import App from './App.jsx'
import './styles/variables.css'
import './styles/global.css'
import './styles/components.css'

applyTheme()
applyFavicon(clientData.business.favicon)
if (import.meta.env.DEV) validateConfig(clientData)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
