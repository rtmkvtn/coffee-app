import { useState, useTransition } from 'react'

import Button from '@components/button/Button'
import { getGoodsPlural } from '@components/cartProviderWrapper/cartFooter/cartFooter.helpers'
import { useStore } from '@context/mainContext'
import { formatPrice } from '@lib/helpers'
import classNames from 'classnames'

import Icon from '@assets/images/Icon'

import styles from './CartFooter.module.scss'
import CartItem from './cartItem/CartItem'

const CartFooter = () => {
  const {
    cart,
    removeFromCart,
    updateCartItemQuantity,
    categories,
    createOrder,
  } = useStore()
  const hasItems = cart?.items && cart.items.length > 0
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleIconsClick = () => {
    setIsExpanded(!isExpanded)
  }

  const handleRemoveItem = (itemId: number) => {
    removeFromCart(itemId)
  }

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    updateCartItemQuantity(itemId, newQuantity)
  }

  const handleOrder = () => {
    startTransition(async () => {
      await createOrder()
      setIsExpanded(false)
    })
  }

  const totalPrice =
    cart?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0

  const totalQuantity =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0

  // Group items by subcategory
  const groupedItems = cart?.items.reduce(
    (groups, item) => {
      const subcategoryId = item.subcategory.id

      // Find subcategory name from categories data
      let subcategoryName = 'Другое'
      for (const category of categories) {
        const subcategory = category.subcategories.find(
          (sub) => sub.id === subcategoryId
        )
        if (subcategory) {
          subcategoryName = subcategory.name
          break
        }
      }

      if (!groups[subcategoryId]) {
        groups[subcategoryId] = {
          name: subcategoryName,
          items: [],
        }
      }
      groups[subcategoryId].items.push(item)
      return groups
    },
    {} as Record<number, { name: string; items: typeof cart.items }>
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
          <span className={styles.itemsCount}>
            {totalQuantity} {getGoodsPlural(totalQuantity)}
          </span>
          <span className={styles.totalPrice}>{formatPrice(totalPrice)}</span>
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
          {groupedItems &&
            Object.entries(groupedItems).map(([subcategoryId, group]) => (
              <div key={subcategoryId} className={styles.subcategoryGroup}>
                <h3 className={styles.subcategoryName}>{group.name}</h3>
                {group.items.map((item) => (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    quantity={item.quantity}
                    price={item.price}
                    onRemove={handleRemoveItem}
                    onQuantityChange={handleQuantityChange}
                  />
                ))}
              </div>
            ))}
        </div>
      )}

      {hasItems && isExpanded && (
        <div className={styles.orderFooter}>
          <Button
            text="Заказать"
            mode="primary"
            onClick={handleOrder}
            className={styles.orderButton}
            loading={isPending}
            disabled={isPending}
          />
        </div>
      )}
    </div>
  )
}

export default CartFooter
