import OrderStatus from '@components/orderStatus/OrderStatus'
import { formatDate, formatPrice } from '@lib/helpers'
import { IOrder } from '@models/index'
import classNames from 'classnames'

import styles from './OrderListItem.module.scss'

type OrderListItemProps = {
  order: IOrder
  className?: string
}

const OrderListItem = ({ order, className }: OrderListItemProps) => {
  return (
    <div className={classNames(styles.wrapper, className)}>
      <div className={styles.header}>
        <div className={styles.id}># {order.id}</div>
        <OrderStatus status={order.state} />
      </div>
      <div className={styles.footer}>
        <div className={styles.date}>{formatDate(order.createdAt, true)}</div>
        <div className={styles.amount}>{formatPrice(order.amount)}</div>
      </div>
    </div>
  )
}

export default OrderListItem
