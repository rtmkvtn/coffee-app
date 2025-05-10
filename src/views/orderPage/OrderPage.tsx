import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { showToast } from '@lib/toasts/toast'
import { IOrder } from '@models/index'
import { getOrderById } from '@services/ordersService'

import OrderItem from './orderItem/OrderItem'
import styles from './OrderPage.module.scss'

const OrderPage = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState<IOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        showToast('Order ID is missing', 'error')
        return
      }

      try {
        setIsLoading(true)
        const response = await getOrderById(orderId)
        if (!response.success) {
          throw new Error('Failed to load order')
        }
        setOrder(response.data)
      } catch (error) {
        console.error('Error fetching order:', error)
        showToast('Failed to load order', 'error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (isLoading) {
    return <div className={styles.wrapper}>Loading...</div>
  }

  if (!order) {
    return <div className={styles.wrapper}>Order not found</div>
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
