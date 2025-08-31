import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TeslaLayout from './TeslaLayout.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TeslaLayout />
  </StrictMode>,
)
