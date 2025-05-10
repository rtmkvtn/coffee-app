import { useEffect, useState, useTransition } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import Button from '@components/button/Button'
import { HOME_PATH } from '@constants/routes'
import { useStore } from '@context/mainContext'
import { useModal } from '@context/modalContext'
import { showToast } from '@lib/toasts/toast'
import { IOrder } from '@models/index'
import {
  cancelOrder,
  getOrderById,
  updateOrderStatus,
} from '@services/ordersService'

import OrderItem from './orderItem/OrderItem'
import styles from './OrderPage.module.scss'

const OrderPage = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [isPending, startTransition] = useTransition()
  const { showModal } = useModal()
  const { refreshOrders } = useStore()
  const [order, setOrder] = useState<IOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const handleCancel = () => {
    if (!orderId) return

    showModal({
      type: 'confirm',
      title: 'Отменить заказ',
      content: 'Вы уверены, что хотите отменить заказ?',
      confirmText: 'Отменить',
      cancelText: 'Нет',
      onConfirm: () => {
        startTransition(async () => {
          try {
            const response = await cancelOrder(orderId)
            if (!response.success) {
              throw new Error('Failed to cancel order')
            }
            setOrder(response.data)
            await refreshOrders()
            showToast('Заказ отменен', 'success')
            navigate(HOME_PATH)
          } catch (error) {
            console.error('Error canceling order:', error)
            showToast('Не удалось отменить заказ', 'error')
          }
        })
      },
    })
  }

  const handlePay = async () => {
    if (!orderId) return

    startTransition(async () => {
      try {
        const response = await updateOrderStatus(orderId, 'paymentProcessing')
        if (!response.success) {
          throw new Error('Failed to process payment')
        }
        setOrder(response.data)
        showToast('Payment processing started', 'success')
      } catch (error) {
        console.error('Error processing payment:', error)
        showToast('Failed to process payment', 'error')
      }
    })
  }

  if (isLoading) {
    return <div className={styles.wrapper}>Loading...</div>
  }

  if (!order) {
    return <div className={styles.wrapper}>Order not found</div>
  }

  const canCancel = order.state === 'waitingForPayment'
  const canPay = order.state === 'waitingForPayment'

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Заказ #{order.id}</h1>
      <div className={styles.ordersList}>
        <OrderItem order={order} />
      </div>
      <div className={styles.actions}>
        {canCancel && (
          <Button
            text="Отменить заказ"
            mode="secondary"
            onClick={handleCancel}
            loading={isPending}
            disabled={isPending}
            className={styles.actionButton}
          />
        )}
        {canPay && (
          <Button
            text="Оплатить"
            mode="primary"
            onClick={handlePay}
            loading={isPending}
            disabled={isPending}
            className={styles.actionButton}
          />
        )}
      </div>
    </div>
  )
}

export default OrderPage
