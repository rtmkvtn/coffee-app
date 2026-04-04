import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'

import GlobalLoader from '@components/loaders/globalLoader/GlobalLoader'
import OrderItem from '@components/orderItem'
import { useOrders } from '@context/ordersContext'

import styles from './OrdersPage.module.scss'

const OrdersPage = () => {
  const { orders, loading, refreshOrders } = useOrders()
  const { t } = useTranslation()

  useEffect(() => {
    refreshOrders()
  }, [])

  if (loading) {
    return <GlobalLoader />
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.ordersList}>
        {orders.map((order) => (
          <div key={order.id} className={styles.orderItem}>
            <OrderItem order={order} />
          </div>
        ))}
        {orders.length === 0 && (
          <div className={styles.emptyState}>{t('orders.emptyOrders')}</div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage
