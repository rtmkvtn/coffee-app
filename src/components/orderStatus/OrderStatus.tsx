import { FC } from 'react'

import { getOrderStatusText } from '@lib/helpers'
import { OrderStatus as OrderStatusType } from '@models/index'
import classNames from 'classnames'

import styles from './OrderStatus.module.scss'

type OrderStatusProps = {
  status: OrderStatusType
  className?: string
}

const OrderStatus: FC<OrderStatusProps> = ({ status, className }) => {
  const getStatusColor = (state: OrderStatusType) => {
    switch (state) {
      case 'draft':
        return styles.draft
      case 'waitingForPayment':
        return styles.waiting
      case 'paymentProcessing':
        return styles.processing
      case 'paid':
        return styles.paid
      case 'preparing':
        return styles.preparing
      case 'completed':
        return styles.completed
      case 'canceled':
        return styles.canceled
      default:
        return ''
    }
  }

  return (
    <div
      className={classNames(styles.status, getStatusColor(status), className)}
    >
      {getOrderStatusText(status)}
    </div>
  )
}

export default OrderStatus
