import { useStore } from '@context/mainContext'

import Icon from '@assets/images/Icon'

import styles from './CartFooter.module.scss'

const CartFooter = () => {
  const { cart } = useStore()
  const hasItems = cart?.items && cart.items.length > 0

  if (!hasItems) return null

  return (
    <div className={styles.cartButton}>
      <div className={styles.cartInfo}>
        <span className={styles.itemsCount}>{cart.items.length} items</span>
        <span className={styles.totalPrice}>
          {cart.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          )}{' '}
          ₽
        </span>
      </div>
      <Icon type="cart" size={24} />
    </div>
  )
}

export default CartFooter
