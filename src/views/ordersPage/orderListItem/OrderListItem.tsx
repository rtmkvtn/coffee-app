import { formatDate, formatPrice, getOrderStatusText } from '@lib/helpers'
import { IOrder } from '@models/index'
import classNames from 'classnames'

import styles from './OrderListItem.module.scss'

type OrderListItemProps = {
  order: IOrder
  className?: string
}

const OrderListItem = ({ order, className }: OrderListItemProps) => {
  const getStatusColor = (state: IOrder['state']) => {
    switch (state) {
      case 'waitingForPayment':
        return styles.waiting
      case 'paymentProcessing':
        return styles.processing
      case 'paid':
        return styles.paid
      case 'completed':
        return styles.completed
      case 'canceled':
        return styles.canceled
      default:
        return ''
    }
  }

  return (
    <div className={classNames(styles.wrapper, className)}>
      <div className={styles.header}>
        <div className={styles.id}># {order.id}</div>
        <div className={classNames(styles.status, getStatusColor(order.state))}>
          {getOrderStatusText(order.state)}
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.date}>{formatDate(order.createdAt, true)}</div>
        <div className={styles.amount}>{formatPrice(order.amount)}</div>
      </div>
    </div>
  )
}

export default OrderListItem
