import { FC } from 'react'

import Icon from '@assets/images/Icon'

import styles from './CartItem.module.scss'

interface CartItemProps {
  name: string
  quantity: number
  price: number
  id: number
  onRemove: (id: number) => void
}

const CartItem: FC<CartItemProps> = ({
  name,
  quantity,
  price,
  id,
  onRemove,
}) => {
  return (
    <div className={styles.item}>
      <div className={styles.itemInfo}>
        <span className={styles.itemName}>{name}</span>
        <span className={styles.itemQuantity}>x{quantity}</span>
      </div>
      <div className={styles.itemActions}>
        <span className={styles.itemPrice}>{price * quantity} ₽</span>
        <button className={styles.removeButton} onClick={() => onRemove(id)}>
          <Icon type="trash" size={16} />
        </button>
      </div>
    </div>
  )
}

export default CartItem
