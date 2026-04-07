import { Suspense, useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Route } from 'react-router'
import { Routes } from 'react-router-dom'

import GlobalLoader from '@components/loaders/globalLoader/GlobalLoader'
import {
  HOME_PATH,
  MENU_PATH,
  NOT_FOUND_PATH,
  ORDER_PATH,
  ORDER_SUCCESS_PATH,
  ORDERS_PATH,
} from '@constants/routes'
import { useCart } from '@context/cartContext'
import { useMenu } from '@context/menuContext'
import { useOrders } from '@context/ordersContext'
import { useUser } from '@context/userContext'
import { useBackButton } from '@hooks/useBackButton'
import { useTelegram } from '@hooks/useTelegram'
import { normalizeLocale } from '@lib/helpers/locale'
import Layout from '@lib/layout/Layout'
import { showToast } from '@lib/toasts/toast'
import HomePage from '@views/homePage/HomePage'
import MenuPage from '@views/menuPage/MenuPage'
import NotFoundPage from '@views/notFoundPage/NotFoundPage'
import OrderPage from '@views/orderPage'
import OrdersPage from '@views/ordersPage/OrdersPage'
import OrderSuccessPage from '@views/orderSuccessPage/OrderSuccessPage'

import Icon from '@assets/images/Icon'

import './App.scss'

function App() {
  const [isInitialized, setIsInitialized] = useState(false)
  const { t, i18n } = useTranslation()
  const initErrorMessage = t('errors.init')

  const { initData, isReady: tgIsReady } = useTelegram()
  const { authenticate } = useUser()
  const { refreshCategories, refreshProducts } = useMenu()
  const { refreshOrders } = useOrders()
  const { initializeCart } = useCart()

  const { showDevFallback, onDevBack } = useBackButton()

  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty(
        '--app-height',
        `${window.innerHeight}px`
      )
    }

    // Set initial height
    setAppHeight()

    // Update on resize
    window.addEventListener('resize', setAppHeight)

    return () => {
      window.removeEventListener('resize', setAppHeight)
    }
  }, [])

  useEffect(() => {
    const initScript = async () => {
      if (initData) {
        try {
          const user = await authenticate(initData)
          const locale = normalizeLocale(user.languageCode ?? '')
          await i18n.changeLanguage(locale)
          await Promise.all([
            refreshCategories(),
            refreshProducts(),
            initializeCart(),
            refreshOrders(),
          ])
          setIsInitialized(true)
        } catch {
          showToast(initErrorMessage, 'error')
        }
      }
    }

    if (!isInitialized) {
      initScript()
    }
  }, [initData, tgIsReady, initErrorMessage])

  return (
    <div className="main-container">
      {showDevFallback && (
        <div
          style={{
            position: 'fixed',
            top: 12,
            left: 12,
            zIndex: 1000,
            cursor: 'pointer',
            transform: 'rotate(180deg)',
          }}
          onClick={onDevBack}
        >
          <Icon type="arrowRight" size={24} />
        </div>
      )}
      {isInitialized ? (
        <Suspense fallback={<GlobalLoader />}>
          <Routes>
            <Route
              path={MENU_PATH}
              element={
                <Layout withCartProvider>
                  <MenuPage />
                </Layout>
              }
            />
            <Route
              path={ORDERS_PATH}
              loader={refreshOrders}
              element={
                <Layout>
                  <OrdersPage />
                </Layout>
              }
            />
            <Route
              path={ORDER_PATH}
              element={
                <Layout>
                  <OrderPage />
                </Layout>
              }
            />
            <Route
              path={ORDER_SUCCESS_PATH}
              element={
                <Layout>
                  <OrderSuccessPage />
                </Layout>
              }
            />
            <Route
              path={HOME_PATH}
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            <Route
              path={NOT_FOUND_PATH}
              element={
                <Layout>
                  <NotFoundPage />
                </Layout>
              }
            />
          </Routes>
        </Suspense>
      ) : (
        <GlobalLoader />
      )}
    </div>
  )
}

export default App
