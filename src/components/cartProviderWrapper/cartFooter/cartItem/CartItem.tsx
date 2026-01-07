import { FC, useCallback, useEffect, useRef, useState } from 'react'

import { useTranslation } from 'react-i18next'

import ProductImage from '@components/productImage/ProductImage'
import { CART_CONSTANTS } from '@constants/cart'
import { formatPrice, getImgUrl } from '@lib/helpers'
import { getIngredientKey } from '@lib/helpers/cartUtils'
import { LocalizedAdditionalIngredient } from '@models/index'
import { IProductTemperature } from '@models/product.model'
import ProductCartButton from '@views/menuPage/menuItem/productCartButton/ProductCartButton'
import classNames from 'classnames'

import Icon from '@assets/images/Icon'

import styles from './CartItem.module.scss'

interface CartItemProps {
  cartItemKey: string
  name: string
  quantity: number
  price: number
  image?: string
  additionalIngredients?: LocalizedAdditionalIngredient[]
  weight: string
  temperature?: IProductTemperature
  categoryName: string
  isLoading?: boolean
  onRemove: (cartItemKey: string) => void
  onQuantityChange: (cartItemKey: string, newQuantity: number) => void
}

const CartItem: FC<CartItemProps> = ({
  cartItemKey,
  name,
  quantity,
  price,
  image,
  additionalIngredients,
  weight,
  temperature,
  categoryName,
  isLoading = false,
  onRemove,
  onQuantityChange,
}) => {
  const { t } = useTranslation('cart')
  const [isFlashing, setIsFlashing] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [isIngredientsExpanded, setIsIngredientsExpanded] = useState(false)

  // Stable refs to prevent stale closures
  const onRemoveRef = useRef(onRemove)
  const onQuantityChangeRef = useRef(onQuantityChange)

  useEffect(() => {
    onRemoveRef.current = onRemove
    onQuantityChangeRef.current = onQuantityChange
  }, [onRemove, onQuantityChange])

  useEffect(() => {
    if (isFlashing) {
      const timer = setTimeout(() => {
        setIsFlashing(false)
      }, CART_CONSTANTS.ANIMATION.PRICE_FLASH)
      return () => clearTimeout(timer)
    }
  }, [isFlashing])

  useEffect(() => {
    if (isRemoving) {
      const timer = setTimeout(() => {
        onRemoveRef.current(cartItemKey)
      }, CART_CONSTANTS.ANIMATION.ITEM_REMOVE)
      return () => clearTimeout(timer)
    }
  }, [isRemoving, cartItemKey])

  const handleDecrease = useCallback(() => {
    if (quantity > CART_CONSTANTS.MIN_QUANTITY && !isLoading) {
      onQuantityChangeRef.current(cartItemKey, quantity - 1)
      setIsFlashing(true)
    }
  }, [quantity, cartItemKey, isLoading])

  const handleIncrease = useCallback(() => {
    if (quantity < CART_CONSTANTS.MAX_QUANTITY && !isLoading) {
      onQuantityChangeRef.current(cartItemKey, quantity + 1)
      setIsFlashing(true)
    }
  }, [quantity, cartItemKey, isLoading])

  const handleRemove = useCallback(() => {
    if (!isLoading) {
      setIsRemoving(true)
    }
  }, [isLoading])

  const handleToggleIngredients = useCallback(() => {
    setIsIngredientsExpanded((prev) => !prev)
  }, [])

  const hasIngredients =
    additionalIngredients && additionalIngredients.length > 0

  return (
    <div className={classNames(styles.item, isRemoving && styles.removing)}>
      <div className={styles.avatarWrapper}>
        <ProductImage
          imgSrc={image ? getImgUrl(image) : ''}
          className={styles.avatar}
          altText={name}
          temperatures={temperature ? [temperature] : []}
        />
        {hasIngredients && (
          <button
            type="button"
            className={styles.ingredientsBadge}
            onClick={handleToggleIngredients}
            aria-label={t('showIngredients', {
              count: additionalIngredients.length,
            })}
            aria-expanded={isIngredientsExpanded}
            disabled={isLoading}
          >
            +{additionalIngredients.length}
          </button>
        )}
      </div>
      <div className={styles.infoBlock}>
        <div className={styles.infoHeader}>
          <p className={styles.category}>{categoryName}</p>
          <h3 className={styles.name}>{name}</h3>
          <button
            type="button"
            className={styles.rmBtn}
            onClick={handleRemove}
            aria-label={t('removeItem', { name })}
            disabled={isLoading}
          >
            <Icon type="close" size={12} />
          </button>
        </div>
        <div className={styles.infoFooter}>
          <div className={styles.infoFooterLeft}>
            <p className={styles.weight}>{weight}</p>
            <p className={styles.price}>{formatPrice(price)}</p>
          </div>
          <div className={styles.infoFooterRight}>
            <ProductCartButton
              onAddToCart={handleIncrease}
              onRemoveFromCart={handleDecrease}
              quantity={quantity}
              loading={isLoading}
            />
          </div>
        </div>
      </div>
      {hasIngredients && (
        <div
          className={classNames(
            styles.ingredientsList,
            isIngredientsExpanded && styles.expanded
          )}
          role="region"
          aria-label={
            isIngredientsExpanded
              ? t('hideIngredients')
              : t('showIngredients', { count: additionalIngredients.length })
          }
        >
          {additionalIngredients.map((ingredient) => (
            <div
              key={getIngredientKey(ingredient)}
              className={styles.ingredientItem}
            >
              <span className={styles.ingredientName}>{ingredient.name}</span>
              <span className={styles.ingredientWeight}>
                {ingredient.weight}
              </span>
              <span className={styles.ingredientPrice}>
                +{formatPrice(ingredient.priceModifier)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CartItem
