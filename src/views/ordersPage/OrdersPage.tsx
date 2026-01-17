import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'

import OrderItem from '@components/orderItem'
import { useOrders } from '@context/ordersContext'

import styles from './OrdersPage.module.scss'

const OrdersPage = () => {
  const { orders, refreshOrders } = useOrders()
  const { t } = useTranslation()

  useEffect(() => {
    refreshOrders()
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.ordersList}>
        {orders.map((order) => (
          <div key={order.documentId} className={styles.orderItem}>
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
