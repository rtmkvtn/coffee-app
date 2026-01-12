import { useEffect, useState, useTransition } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import Button from '@components/button/Button'
import TilesSelect from '@components/tilesSelect/TilesSelect'
import { PAYMENT_METHODS } from '@constants/index'
import { HOME_PATH } from '@constants/routes'
import { useModal } from '@context/modalContext'
import { useOrders } from '@context/ordersContext'
import { showToast } from '@lib/toasts/toast'
import { IOrder, IPaymentMethod } from '@models/index'
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
  const { refreshOrders } = useOrders()
  const [order, setOrder] = useState<IOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [paymentMethod, setPaymentMethod] = useState<IPaymentMethod>('cash')

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

  const handleConfirm = () => {
    startTransition(async () => {
      if (!orderId) return

      try {
        const response = await updateOrderStatus(
          orderId,
          'preparing',
          paymentMethod
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
  }

  if (isLoading) {
    return <div className={styles.wrapper}>Loading...</div>
  }

  if (!order) {
    return <div className={styles.wrapper}>Order not found</div>
  }

  const canCancel =
    order.state === 'waitingForPayment' || order.state === 'draft'
  const canConfirm = order.state === 'draft'
  const canPay = order.state === 'waitingForPayment'

  const withAction = canCancel || canPay
  const isPreparing = order.state === 'preparing'

  return (
    <div className={styles.wrapper}>
      <div className={styles.ordersList}>
        <OrderItem order={order} />
      </div>
      {
        <TilesSelect
          options={PAYMENT_METHODS.map((x) => ({
            label: x.label,
            value: x.key,
            emoji: x.emoji,
          }))}
          onSelect={(newValue) => {
            setPaymentMethod(newValue[0] as IPaymentMethod)
          }}
          value={[paymentMethod]}
          isBlue
        />
      }
      {(withAction || isPreparing) && (
        <div className={styles.footer}>
          {withAction && (
            <div className={styles.actions}>
              {canConfirm && (
                <Button
                  text="Оформить заказ"
                  mode="primary"
                  onClick={handleConfirm}
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
              {canCancel && (
                <Button
                  text="Отменить заказ"
                  mode="danger"
                  onClick={handleCancel}
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
