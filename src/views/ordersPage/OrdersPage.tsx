import { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import { ORDER_PATH } from '@constants/routes'
import { useOrders } from '@context/ordersContext'
import { IOrder } from '@models/index'

import OrderListItem from './orderListItem/OrderListItem'
import styles from './OrdersPage.module.scss'

const OrdersPage = () => {
  const { orders, refreshOrders } = useOrders()
  const navigate = useNavigate()

  useEffect(() => {
    refreshOrders()
  }, [])

  const handleOrderClick = (order: IOrder) => {
    navigate(ORDER_PATH.replace(':orderId', order.documentId))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.ordersList}>
        {orders.map((order) => (
          <div
            key={order.documentId}
            className={styles.orderItem}
            onClick={() => handleOrderClick(order)}
          >
            <OrderListItem order={order} />
          </div>
        ))}
        {orders.length === 0 && (
          <div className={styles.emptyState}>У вас пока нет заказов</div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage
