import { memo } from 'react'

import { useTranslation } from 'react-i18next'

import Button from '@components/button/Button'
import OrderStatus from '@components/orderStatus/OrderStatus'
import { formatPrice } from '@lib/helpers'
import { IOrder } from '@models/index'
import classNames from 'classnames'

import styles from './OrderItem.module.scss'

type Props = {
  order: IOrder
}

const OrderItem = memo(({ order }: Props) => {
  const { t } = useTranslation()

  if (!order.items || order.items.length === 0) {
    return null
  }

  return (
    <div className={classNames(styles.wrapper, styles.draftBorder)}>
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
      {/*{order.state === 'completed' && (*/}
      <div className={styles.footer}>
        <Button
          className={styles.footerBtn}
          text="Повторить заказ"
          mode="secondary"
        />
      </div>
      {/*)}*/}
    </div>
  )
})

OrderItem.displayName = 'OrderItem'

export default OrderItem
