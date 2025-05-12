import { formatDate, formatPrice, getOrderStatusText } from '@lib/helpers'
import { IOrder } from '@models/index'
import classNames from 'classnames'

import Icon from '@assets/images/Icon'

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

  const getStatusIcon = (state: IOrder['state']) => {
    switch (state) {
      case 'waitingForPayment':
        return <Icon type="collectCoins" size={16} />
      case 'paymentProcessing':
      case 'paid':
        return <Icon type="slip" size={16} />
      case 'preparing':
        return <Icon type="clock" size={16} />
      case 'completed':
        return <Icon type="check" size={16} />
      case 'canceled':
        return <Icon type="close" size={16} />
      default:
        return null
    }
  }

  return (
    <div className={classNames(styles.wrapper, className)}>
      <div className={styles.header}>
        <div className={styles.id}># {order.id}</div>
        <div className={classNames(styles.status, getStatusColor(order.state))}>
          {getStatusIcon(order.state)}
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
