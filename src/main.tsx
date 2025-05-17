import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Modal from '@components/modal/Modal'
import { CartProvider } from '@context/cartContext'
import { MenuProvider } from '@context/menuContext'
import { ModalProvider } from '@context/modalContext'
import { OrdersProvider } from '@context/ordersContext'
import { UserProvider } from '@context/userContext'
import { toastConfig } from '@lib/toasts/toast'
import '@lib/toasts/toast.scss'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter
      basename={import.meta.env.MODE === 'development' ? '/' : '/web-app'}
    >
      <UserProvider>
        <MenuProvider>
          <CartProvider>
            <OrdersProvider>
              <ModalProvider>
                <App />
                <Modal />
              </ModalProvider>
              <ToastContainer {...toastConfig} />
            </OrdersProvider>
          </CartProvider>
        </MenuProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
)
