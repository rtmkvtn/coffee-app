import { formatPrice } from '@lib/helpers'
import { IOrder } from '@models/index'
import classNames from 'classnames'

import styles from './OrderItem.module.scss'

type Props = {
  order: IOrder
}

const OrderItem = ({ order }: Props) => {
  const getStatusText = (status: string) => {
    switch (status) {
      case 'waitingForPayment':
        return 'Ожидает оплаты'
      case 'paymentProcessing':
        return 'Обработка оплаты'
      case 'paid':
        return 'Оплачен'
      case 'completed':
        return 'Выполнен'
      case 'canceled':
        return 'Отменен'
      default:
        return status
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.orderNumber}>Заказ #{order.id}</span>
        <span
          className={classNames(styles.status, styles[`status_${order.state}`])}
        >
          {getStatusText(order.state)}
        </span>
      </div>
      <div className={styles.content}>
        <div className={styles.items}>
          {order.items.map((item) => (
            <div key={item.id} className={styles.item}>
              <span className={styles.itemName}>
                {item.name} x{item.quantity}
              </span>
              <span className={styles.itemPrice}>
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <span className={styles.total}>Итого:</span>
          <span className={styles.totalPrice}>{formatPrice(order.amount)}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderItem
