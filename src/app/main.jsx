import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@material-tailwind/react';
import { BrowserRouter } from 'react-router-dom';

import './../styles/index.css'
import App from './App.jsx'

console.log("URL del servicio de autenticación: ", import.meta.env.VITE_AUTH_URL);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)