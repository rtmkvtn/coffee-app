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
  ORDERS_PATH,
} from '@constants/routes'
import { useCart } from '@context/cartContext'
import { useMenu } from '@context/menuContext'
import { useOrders } from '@context/ordersContext'
import { useUser } from '@context/userContext'
import { useTelegram } from '@hooks/useTelegram'
import Layout from '@lib/layout/Layout'
import { showToast } from '@lib/toasts/toast'
import HomePage from '@views/homePage/HomePage'
import MenuPage from '@views/menuPage/MenuPage'
import NotFoundPage from '@views/notFoundPage/NotFoundPage'
import OrderPage from '@views/orderPage'
import OrdersPage from '@views/ordersPage/OrdersPage'

import './App.scss'

function App() {
  const [isInitialized, setIsInitialized] = useState(false)
  const { t } = useTranslation()
  const initErrorMessage = t('errors.init')

  const { initData, isReady: tgIsReady } = useTelegram()
  const { authenticate } = useUser()
  const { refreshCategories, refreshProducts } = useMenu()
  const { refreshOrders } = useOrders()
  const { initializeCart } = useCart()

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
          await authenticate(initData)
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
  }, [tgIsReady, initErrorMessage])

  return (
    <div className="main-container">
      {isInitialized ? (
        <Suspense fallback={<GlobalLoader />}>
          <Routes>
            <Route
              path={MENU_PATH}
              element={
                <Layout
                  withCartProvider
                  withNavHeader
                  headerText={t('navigation.menu')}
                >
                  <MenuPage />
                </Layout>
              }
            />
            <Route
              path={ORDERS_PATH}
              loader={refreshOrders}
              element={
                <Layout withNavHeader headerText={t('navigation.orders')}>
                  <OrdersPage />
                </Layout>
              }
            />
            <Route
              path={ORDER_PATH}
              element={
                <Layout withNavHeader headerText={t('navigation.order')}>
                  <OrderPage />
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
