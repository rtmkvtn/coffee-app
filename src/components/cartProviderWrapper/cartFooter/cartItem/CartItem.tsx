import { FC, useEffect, useState } from 'react'

import classNames from 'classnames'

import Icon from '@assets/images/Icon'

import styles from './CartItem.module.scss'

interface CartItemProps {
  name: string
  quantity: number
  price: number
  id: number
  onRemove: (id: number) => void
  onQuantityChange: (id: number, newQuantity: number) => void
}

const CartItem: FC<CartItemProps> = ({
  name,
  quantity,
  price,
  id,
  onRemove,
  onQuantityChange,
}) => {
  const [isFlashing, setIsFlashing] = useState(false)

  useEffect(() => {
    if (isFlashing) {
      const timer = setTimeout(() => {
        setIsFlashing(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isFlashing])

  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(id, quantity - 1)
      setIsFlashing(true)
    }
  }

  const handleIncrease = () => {
    onQuantityChange(id, quantity + 1)
    setIsFlashing(true)
  }

  return (
    <div className={styles.item}>
      <div className={styles.itemInfo}>
        <span className={styles.itemName}>{name}</span>
        <div className={styles.quantityRow}>
          <span className={styles.itemQuantity}>
            {price} ₽ <span>x {quantity}</span>
          </span>
          <div className={styles.quantityControls}>
            <button
              className={styles.quantityButton}
              onClick={handleDecrease}
              disabled={quantity <= 1}
            >
              <Icon type="minus" size={16} />
            </button>
            <button className={styles.quantityButton} onClick={handleIncrease}>
              <Icon type="plus" size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className={styles.itemActions}>
        <span
          className={classNames(styles.itemPrice, isFlashing && styles.flash)}
        >
          {price * quantity} ₽
        </span>
        <button className={styles.removeButton} onClick={() => onRemove(id)}>
          <Icon type="trash" size={16} />
        </button>
      </div>
    </div>
  )
}

export default CartItem
