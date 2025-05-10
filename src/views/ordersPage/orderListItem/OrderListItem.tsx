import { formatPrice } from '@lib/helpers'
import { IOrder } from '@models/index'
import classNames from 'classnames'

import styles from './OrderListItem.module.scss'

type OrderListItemProps = {
  order: IOrder
  className?: string
}

const OrderListItem = ({ order, className }: OrderListItemProps) => {
  const getStatusText = (state: IOrder['state']) => {
    switch (state) {
      case 'waitingForPayment':
        return 'Ожидает оплаты'
      case 'paymentProcessing':
        return 'Обработка оплаты'
      case 'paid':
        return 'Оплачен'
      case 'completed':
        return 'Завершен'
      case 'canceled':
        return 'Отменен'
      default:
        return state
    }
  }

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className={classNames(styles.wrapper, className)}>
      <div className={styles.header}>
        <div className={styles.date}>{formatDate(order.createdAt)}</div>
        <div className={classNames(styles.status, getStatusColor(order.state))}>
          {getStatusText(order.state)}
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.amount}>{formatPrice(order.amount)}</div>
      </div>
    </div>
  )
}

export default OrderListItem
