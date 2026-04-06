import { useEffect, useMemo, useState, useTransition } from 'react'

import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import Button from '@components/button/Button'
import OrderItem from '@components/orderItem'
import RadioSelect, { IRadioOption } from '@components/radioSelect/RadioSelect'
import { EMOJI } from '@constants/index'
import { ORDER_SUCCESS_PATH, ORDERS_PATH } from '@constants/routes'
import { useModal } from '@context/modalContext'
import { useOrders } from '@context/ordersContext'
import { IPaymentMethod } from '@models/index'

import styles from './OrderPage.module.scss'

const OrderPage = () => {
  const { orderId } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { orders, refreshOrders, confirmOrder, cancelOrder } = useOrders()
  const { showModal, hideModal } = useModal()
  const [selectedPayment, setSelectedPayment] = useState<IPaymentMethod>('CASH')
  const [isConfirming, startConfirmTransition] = useTransition()
  const [isCanceling, startCancelTransition] = useTransition()

  const PAYMENT_OPTIONS: IRadioOption[] = useMemo(
    () => [
      // { label: t('payment.cardOnPickup'), value: 'CARD', icon: EMOJI.CREDIT_CARD },
      { label: t('payment.cashOnPickup'), value: 'CASH', icon: EMOJI.CASH },
    ],
    [t]
  )

  useEffect(() => {
    refreshOrders()
  }, [orderId])

  const order = orders.find((o) => o.id === orderId)

  const handleConfirm = () => {
    if (!orderId) return
    startConfirmTransition(async () => {
      const success = await confirmOrder(orderId, selectedPayment)
      if (success) {
        navigate(ORDER_SUCCESS_PATH, { replace: true })
      }
    })
  }

  const handleCancel = () => {
    if (!orderId) return
    showModal({
      type: 'confirm',
      content: t('orders.confirmCancel'),
      confirmText: t('orders.cancelButton'),
      cancelText: t('orders.cancelButtonNo'),
      onConfirm: () => {
        hideModal()
        startCancelTransition(async () => {
          const success = await cancelOrder(orderId)
          if (success) {
            navigate(ORDERS_PATH)
          }
        })
      },
      onCancel: () => hideModal(),
    })
  }

  if (!order) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.ordersList}>
          <p>{t('orders.orderNotFound')}</p>
        </div>
      </div>
    )
  }

  const isDraft = order.state === 'DRAFT'

  return (
    <div className={styles.wrapper}>
      <div className={styles.ordersList}>
        <OrderItem order={order} hideActions />

        {isDraft && order.comment && (
          <div className={styles.commentSection}>
            <h3 className={styles.commentLabel}>{t('cart.comment.label')}</h3>
            <p className={styles.commentText}>{order.comment}</p>
          </div>
        )}

        {isDraft && (
          <div className={styles.paymentSection}>
            <h3 className={styles.paymentTitle}>{t('payment.selectMethod')}</h3>
            <RadioSelect
              options={PAYMENT_OPTIONS}
              value={selectedPayment}
              onSelect={(v) => setSelectedPayment(v as IPaymentMethod)}
            />
          </div>
        )}
      </div>

      {isDraft && (
        <div className={styles.footer}>
          <div className={styles.actions}>
            <Button
              text={t('orders.cancelOrderButton')}
              mode="secondary"
              onClick={handleCancel}
              className={styles.actionButton}
              loading={isCanceling}
              disabled={isConfirming || isCanceling}
            />
            <Button
              text={t('orders.confirmOrderButton')}
              mode="primary"
              onClick={handleConfirm}
              className={styles.actionButton}
              loading={isConfirming}
              disabled={isConfirming || isCanceling}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderPage
