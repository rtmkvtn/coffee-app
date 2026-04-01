import { useMemo, useTransition } from 'react'

import ProductImage from '@components/productImage/ProductImage'
import ProductSelectionModal from '@components/productSelectionModal/ProductSelectionModal'
import { useCart } from '@context/cartContext'
import { useModal } from '@context/modalContext'
import {
  formatPrice,
  getImgUrl,
  getSimpleProductConfig,
  isSimpleProduct,
} from '@lib/helpers'
import { IProduct, IProductPortion } from '@models/index'

import styles from './MenuItem.module.scss'
import ProductCartButton from './productCartButton/ProductCartButton'

type Props = {
  product: IProduct
}

const MenuItem = ({ product }: Props) => {
  const {
    items,
    addToCart,
    updateCartItemQuantityByProductId,
    removeFromCartByProductId,
  } = useCart()
  const { showModal, hideModal } = useModal()

  const quantityInCart =
    items.find((x) => x.productId === product.id)?.quantity ?? undefined

  const [isPending, startTransition] = useTransition()

  const handleCardClick = (): void => {
    showModal({
      type: 'custom',
      content: (
        <ProductSelectionModal
          product={product}
          onAddToCart={(config) => {
            startTransition(async () => {
              await addToCart(product.id, config)
              hideModal()
            })
          }}
        />
      ),
    })
  }

  const handleAddToCart = (): void => {
    if (isSimpleProduct(product)) {
      startTransition(async () => {
        const config = getSimpleProductConfig(product)
        await addToCart(product.id, config)
      })
    } else {
      handleCardClick()
    }
  }

  const handleRemoveFromCart = async (): Promise<void> => {
    startTransition(async () => {
      if (quantityInCart && quantityInCart === 1) {
        await removeFromCartByProductId(product.id)
      } else {
        await updateCartItemQuantityByProductId(product.id, quantityInCart! - 1)
      }
    })
  }

  const smallestPortion = useMemo(() => {
    const portions: IProductPortion[] = product.prices
    let result = portions[0]

    if (portions.length === 1) return result

    for (let i = 1; i < portions.length; i++) {
      if (portions[i].price < result.price) {
        result = portions[i]
      }
    }
    return result
  }, [product.prices])

  return (
    <div className={styles.product}>
      <div className={styles.clickableArea} onClick={handleCardClick}>
        <ProductImage
          imgSrc={getImgUrl(product.image ?? undefined)}
          className={styles.avatar}
          altText={product.name}
          temperatures={product.temperatures.map((t) => t.type)}
        />
        <div className={styles.info}>
          <div className={styles.header}>
            <p className={styles.name}>{product.name}</p>
            {smallestPortion?.name && (
              <p className={styles.weight}>{smallestPortion.name}</p>
            )}
          </div>
          <p className={styles.price}>{formatPrice(smallestPortion.price)}</p>
        </div>
      </div>
      <ProductCartButton
        loading={isPending}
        quantity={quantityInCart}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        className={styles.addButton}
      />
    </div>
  )
}

export default MenuItem
