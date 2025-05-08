import { useStore } from '@context/mainContext'
import classNames from 'classnames'

import Icon from '@assets/images/Icon'

import styles from './CartFooter.module.scss'

const CartFooter = () => {
  const { cart } = useStore()
  const hasItems = cart?.items && cart.items.length > 0

  return (
    <div className={classNames(styles.wrapper, hasItems && styles.visible)}>
      <div className={styles.cartInfo}>
        <span className={styles.itemsCount}>{cart?.items.length} items</span>
        <span className={styles.totalPrice}>
          {cart?.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          )}{' '}
          ₽
        </span>
      </div>
      <div className={styles.icons}>
        <Icon
          type={'arrowRight'}
          size={16}
          className={classNames(styles.icon, styles.arrow)}
        />
        <Icon
          type="cart"
          size={24}
          className={classNames(styles.icon, styles.cart)}
        />
      </div>
    </div>
  )
}

export default CartFooter
