import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { MainContext } from '@context/index'
import { toastConfig } from '@lib/toasts/toast'
import '@lib/toasts/toast.scss'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MainContext>
        <App />
      </MainContext>
      <ToastContainer {...toastConfig} />
    </BrowserRouter>
  </StrictMode>
)
