import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import OrderItem from '@components/orderItem'
import { useOrders } from '@context/ordersContext'

import styles from './OrderPage.module.scss'

const OrderPage = () => {
  const { orderId } = useParams()
  const { t } = useTranslation()
  const { orders, refreshOrders } = useOrders()

  useEffect(() => {
    refreshOrders()
  }, [orderId])

  const order = orders.find((o) => o.id === orderId)

  if (!order) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.ordersList}>
          <p>{t('orders.orderNotFound')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.ordersList}>
        <OrderItem order={order} />
      </div>
    </div>
  )
}

export default OrderPage
