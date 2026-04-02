import { FC } from 'react'

import { useTranslation } from 'react-i18next'

import { OrderStatus as OrderStatusType } from '@models/index'
import classNames from 'classnames'

import styles from './OrderStatus.module.scss'

type OrderStatusProps = {
  status: OrderStatusType
  className?: string
}

const statusToI18nKey: Record<OrderStatusType, string> = {
  DRAFT: 'draft',
  WAITING_FOR_PAYMENT: 'waitingForPayment',
  PAYMENT_PROCESSING: 'paymentProcessing',
  PAID: 'paid',
  PREPARING: 'preparing',
  COMPLETED: 'completed',
  CANCELED: 'canceled',
}

const getStatusColor = (state: OrderStatusType): string => {
  switch (state) {
    case 'DRAFT':
      return styles.draft
    case 'PREPARING':
      return styles.preparing
    case 'COMPLETED':
      return styles.completed
    case 'CANCELED':
      return styles.canceled
    default:
      return styles.other
  }
}

const OrderStatus: FC<OrderStatusProps> = ({ status, className }) => {
  const { t } = useTranslation()

  const i18nKey = statusToI18nKey[status] ?? status

  return (
    <div
      className={classNames(styles.status, getStatusColor(status), className)}
    >
      {t(`orders.status.${i18nKey}`)}
    </div>
  )
}

export default OrderStatus
