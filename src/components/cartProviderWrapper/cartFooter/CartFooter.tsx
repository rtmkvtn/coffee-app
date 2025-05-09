import { useState } from 'react'

import { useStore } from '@context/mainContext'
import classNames from 'classnames'

import Icon from '@assets/images/Icon'

import styles from './CartFooter.module.scss'
import CartItem from './cartItem/CartItem'

const CartFooter = () => {
  const { cart, removeFromCart } = useStore()
  const hasItems = cart?.items && cart.items.length > 0
  const [isExpanded, setIsExpanded] = useState(false)

  const handleIconsClick = () => {
    setIsExpanded(!isExpanded)
  }

  const handleRemoveItem = (itemId: number) => {
    removeFromCart(itemId)
  }

  const totalPrice = cart?.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <div
      className={classNames(
        styles.wrapper,
        hasItems && styles.visible,
        isExpanded && styles.expanded
      )}
    >
      <div className={styles.content}>
        <div className={styles.cartInfo}>
          <span className={styles.itemsCount}>{cart?.items.length} items</span>
          <span className={styles.totalPrice}>{totalPrice} ₽</span>
        </div>
        <div className={styles.icons} onClick={handleIconsClick}>
          <Icon
            type={'arrowRight'}
            size={16}
            className={classNames(
              styles.icon,
              styles.arrow,
              isExpanded && styles.rotated
            )}
          />
          <Icon
            type="cart"
            size={24}
            className={classNames(styles.icon, styles.cart)}
          />
        </div>
      </div>

      {isExpanded && (
        <div className={styles.itemsList}>
          {cart?.items.map((item) => (
            <CartItem
              key={item.id}
              id={item.id}
              name={item.name}
              quantity={item.quantity}
              price={item.price}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CartFooter
