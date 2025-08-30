import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'



// Busca el div con id="root" en index.html
//Todo lo que devuelva <App /> es lo que realmente se pinta en la página, dentro del div#root del index.html.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
