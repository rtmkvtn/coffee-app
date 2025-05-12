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
import PaymentMethodModal from './paymentMethodModal/PaymentMethodModal'

const OrderPage = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [isPending, startTransition] = useTransition()
  const { showModal } = useModal()
  const { refreshOrders } = useStore()
  const [order, setOrder] = useState<IOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState<number>(0)

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

  useEffect(() => {
    if (order?.state === 'preparing' && order.updatedAt) {
      const updateTime = new Date(order.updatedAt).getTime()
      const now = new Date().getTime()
      const timePassed = Math.floor((now - updateTime) / 1000)
      const timeLeft = Math.max(0, 120 - timePassed)
      setTimeLeft(timeLeft)

      if (timeLeft > 0) {
        const timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)

        return () => clearInterval(timer)
      }
    }
  }, [order?.state, order?.updatedAt])

  const formatTimeLeft = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

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

    showModal({
      type: 'custom',
      content: (
        <PaymentMethodModal
          onCashPayment={() => {
            startTransition(async () => {
              try {
                const response = await updateOrderStatus(
                  orderId,
                  'preparing',
                  'cash'
                )
                if (!response.success) {
                  throw new Error('Failed to update order status')
                }
                setOrder(response.data)
                await refreshOrders()
                showToast('Заказ принят в обработку', 'success')
              } catch (error) {
                console.error('Error updating order status:', error)
                showToast('Не удалось обновить статус заказа', 'error')
              }
            })
          }}
          onCardPayment={() => {
            // TODO: Handle card payment
            console.log('Card payment')
          }}
        />
      ),
    })
  }

  if (isLoading) {
    return <div className={styles.wrapper}>Loading...</div>
  }

  if (!order) {
    return <div className={styles.wrapper}>Order not found</div>
  }

  const canCancel =
    order.state === 'waitingForPayment' ||
    (order.state === 'preparing' && timeLeft > 0)
  const canPay = order.state === 'waitingForPayment'

  const withAction = canCancel || canPay
  const isPreparing = order.state === 'preparing'

  return (
    <div className={styles.wrapper}>
      <div className={styles.ordersList}>
        <OrderItem order={order} />
      </div>
      {(withAction || isPreparing) && (
        <div className={styles.footer}>
          {isPreparing && (
            <div className={styles.statusText}>
              {timeLeft > 0 ? (
                <>
                  Ваш заказ скоро начнут готовить. Вы можете отменить его в
                  течение <strong>{formatTimeLeft(timeLeft)}</strong>, если
                  заметили, что что-то не так.
                </>
              ) : (
                <>Заказ готовят, его уже не получится отменить.</>
              )}
            </div>
          )}
          {withAction && (
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
                  mode="success"
                  onClick={handlePay}
                  loading={isPending}
                  disabled={isPending}
                  className={styles.actionButton}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default OrderPage
