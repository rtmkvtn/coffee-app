import { Route } from 'react-router'
import { Routes } from 'react-router-dom'

import GlobalLoader from '@components/loaders/globalLoader/GlobalLoader'
import {
  HOME_PATH,
  MENU_PATH,
  ORDER_PATH,
  ORDERS_PATH,
} from '@constants/routes'
import { useStore } from '@context/mainContext'
import Layout from '@lib/layout/Layout'
import HomePage from '@views/homePage/HomePage'
import MenuPage from '@views/menuPage/MenuPage'
import OrderPage from '@views/orderPage'
import OrdersPage from '@views/ordersPage/OrdersPage'

import './App.scss'

function App() {
  const { isInitialized } = useStore()

  return (
    <div className="main-container">
      {isInitialized ? (
        <Routes>
          <Route
            path={MENU_PATH}
            element={
              <Layout withCartProvider withNavHeader headerText="Меню">
                <MenuPage />
              </Layout>
            }
          />
          <Route
            path={ORDERS_PATH}
            element={
              <Layout withNavHeader headerText="Заказы">
                <OrdersPage />
              </Layout>
            }
          />
          <Route
            path={ORDER_PATH}
            element={
              <Layout withNavHeader headerText="Заказ">
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
        </Routes>
      ) : (
        <GlobalLoader />
      )}
    </div>
  )
}

export default App
