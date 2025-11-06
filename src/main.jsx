import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import "bootstrap-icons/font/bootstrap-icons.css";
import { Provider } from 'react-redux'
import { store } from './store/index.js'
import { checkSupabaseConfig, verifySupabaseConnectivity } from './supabaseClient.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <BrowserRouter>
       <App/>
    </BrowserRouter>
    </Provider>
  </StrictMode>,
)

// Solo en desarrollo: validar configuración/conexión de Supabase
if (import.meta.env.DEV) {
  if (checkSupabaseConfig()) {
    // No bloquear UI: ejecutar y loguear resultado
    verifySupabaseConnectivity()
  }
}
