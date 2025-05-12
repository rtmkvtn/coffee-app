import OrderStatus from '@components/orderStatus/OrderStatus'
import { formatPrice } from '@lib/helpers'
import { IOrder } from '@models/index'

import styles from './OrderItem.module.scss'

type Props = {
  order: IOrder
}

const OrderItem = ({ order }: Props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.orderNumber}>Заказ #{order.id}</span>
        <OrderStatus status={order.state} />
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
