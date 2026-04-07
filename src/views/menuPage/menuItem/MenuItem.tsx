import { useMemo } from 'react'

import ProductCartButton from '@components/productCartButton/ProductCartButton'
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

type Props = {
  product: IProduct
}

const MenuItem = ({ product }: Props) => {
  const { items, addToCart, removeLastByProductId } = useCart()
  const { showModal, hideModal } = useModal()
  const quantityInCart =
    items
      .filter((x) => x.productId === product.id)
      .reduce((sum, item) => sum + item.quantity, 0) || undefined

  const handleCardClick = (): void => {
    showModal({
      type: 'custom',
      content: (
        <ProductSelectionModal
          product={product}
          onAddToCart={async (config) => {
            await addToCart(product.id, config)
            hideModal()
          }}
        />
      ),
    })
  }

  const handleAddToCart = (): void => {
    if (isSimpleProduct(product)) {
      const config = getSimpleProductConfig(product)
      void addToCart(product.id, config)
    } else {
      handleCardClick()
    }
  }

  const handleRemoveFromCart = (): void => {
    void removeLastByProductId(product.id)
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
          imgSrc={getImgUrl(product.image ?? undefined, 'thumb')}
          className={styles.avatar}
          altText={product.name}
          temperatures={product.temperatures.map((t) => t.type)}
          blurPlaceholder={product.imageBlur}
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
        quantity={quantityInCart}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        className={styles.addButton}
      />
    </div>
  )
}

export default MenuItem
