import { useTranslation } from 'react-i18next'

import OrderStatus from '@components/orderStatus/OrderStatus'
import { formatPrice } from '@lib/helpers'
import { IOrder } from '@models/index'
import classNames from 'classnames'

import styles from './OrderItem.module.scss'

type Props = {
  order: IOrder
}

const OrderItem = ({ order }: Props) => {
  const { t } = useTranslation()

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.draftBorder]: order.state === 'draft',
      })}
    >
      <div className={styles.header}>
        <span className={styles.orderNumber}>
          {t('orders.orderNumber', { id: order.id })}
        </span>
        <OrderStatus status={order.state} />
      </div>
      <div className={styles.content}>
        <div className={styles.items}>
          {order.items.map((item) => (
            <div key={item.id} className={styles.item}>
              <span className={classNames(styles.itemText, styles.itemQuant)}>
                {item.quantity}x
              </span>
              <span className={classNames(styles.itemText, styles.itemName)}>
                {/*need this span for dots positioning*/}
                <span>{item.name}</span>
              </span>
              <span className={classNames(styles.itemText, styles.itemPrice)}>
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.dashDivider} />
        <div className={styles.footer}>
          <span className={classNames(styles.footerText, styles.total)}>
            {t('cart.total')}
          </span>
          <span className={classNames(styles.footerText, styles.totalPrice)}>
            {formatPrice(order.amount)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default OrderItem
