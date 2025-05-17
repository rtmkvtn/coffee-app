import { useTransition } from 'react'

import ProductImage from '@components/productImage/ProductImage'
import { useCart } from '@context/cartContext'
import { formatPrice, getImgUrlFromStrapiMediaOrDefault } from '@lib/helpers'
import { IProduct } from '@models/index'

import styles from './MenuItem.module.scss'
import ProductCartButton from './productCartButton/ProductCartButton'

type Props = {
  product: IProduct
}

const MenuItem = ({ product }: Props) => {
  const { cart, addToCart, updateCartItemQuantity, removeFromCart } = useCart()

  const quantityInCart =
    cart?.items.find((x) => x.id === product.id)?.quantity ?? undefined

  const [isPending, startTransition] = useTransition()

  const handleAddToCart = async (): Promise<void> => {
    startTransition(async () => {
      await addToCart(product)
    })
  }

  const handleRemoveFromCart = async (): Promise<void> => {
    startTransition(async () => {
      if (quantityInCart && quantityInCart === 1) {
        await removeFromCart(product.id)
      } else {
        await updateCartItemQuantity(product.id, quantityInCart! - 1)
      }
    })
  }

  return (
    <div className={styles.product}>
      <ProductImage
        imgSrc={getImgUrlFromStrapiMediaOrDefault(product.avatar)}
        className={styles.avatar}
        altText={product.name}
      />
      <div className={styles.info}>
        <p className={styles.name}>{product.name}</p>
      </div>
      <div className={styles.footer}>
        <p className={styles.price}>{formatPrice(product.price)}</p>
        <ProductCartButton
          loading={isPending}
          quantity={quantityInCart}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          className={styles.addButton}
        />
      </div>
    </div>
  )
}

export default MenuItem
