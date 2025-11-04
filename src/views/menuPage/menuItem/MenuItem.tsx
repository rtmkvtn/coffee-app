import { useMemo, useTransition } from 'react'

import ProductImage from '@components/productImage/ProductImage'
import { useCart } from '@context/cartContext'
import { formatPrice, getImgUrl } from '@lib/helpers'
import { IProduct } from '@models/index'
import { IProductPortion } from '@models/portion.model'

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

  const smallestPortion = useMemo(() => {
    const portions: IProductPortion[] = product.portions
    let result = portions[0]

    if (portions.length === 1) return result

    for (let i = 1; i < portions.length; i++) {
      if (portions[i].price < result.price) {
        result = portions[i]
      }
    }
    return result
  }, [product.portions])

  return (
    <div className={styles.product}>
      <ProductImage
        imgSrc={getImgUrl(product.avatar)}
        className={styles.avatar}
        altText={product.name}
        temperatures={product.temperatures}
      />
      <div className={styles.data}>
        <div className={styles.header}>
          <p className={styles.name}>{product.name}</p>
          {smallestPortion?.weight && (
            <p className={styles.weight}>{smallestPortion.weight}</p>
          )}
        </div>
        <div className={styles.footer}>
          <p className={styles.price}>{formatPrice(smallestPortion.price)}</p>
          <ProductCartButton
            loading={isPending}
            quantity={quantityInCart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            className={styles.addButton}
          />
        </div>
      </div>
    </div>
  )
}

export default MenuItem
