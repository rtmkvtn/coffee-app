import { useMemo, useState } from 'react'

import FireIcon from '@assets/images/common/fire.svg?react'
import IceIcon from '@assets/images/common/ice.svg?react'
import { useTranslation } from 'react-i18next'

import Button from '@components/button/Button'
import ProductImage from '@components/productImage/ProductImage'
import QuantitySelector from '@components/productSelectionModal/quantitySelector/QuantitySelector'
import TilesSelect from '@components/tilesSelect/TilesSelect'
import { formatPrice, getImgUrl } from '@lib/helpers'
import { IProduct } from '@models/index'
import { IProductPortion } from '@models/portion.model'
import { ITemperatureOption } from '@models/product.model'
import classNames from 'classnames'

import styles from './ProductSelectionModal.module.scss'

interface ProductSelectionModalProps {
  product: IProduct
  onAddToCart: (config: {
    portionId: number
    temperatureId?: number
    ingredientIds: number[]
    quantity: number
  }) => void
}

const ProductSelectionModal = ({
  product,
  onAddToCart,
}: ProductSelectionModalProps) => {
  const { t } = useTranslation()

  const [selectedTemperature, setSelectedTemperature] =
    useState<ITemperatureOption | null>(product.temperatures[0] || null)
  const [selectedPortion, setSelectedPortion] = useState<IProductPortion>(
    product.prices.reduce((smallest, current) =>
      current.price < smallest.price ? current : smallest
    )
  )
  const [selectedIngredients, setSelectedIngredients] = useState<Set<number>>(
    new Set()
  )
  const [quantity, setQuantity] = useState(1)

  // Calculate total price
  const totalPrice = useMemo(() => {
    const ingredientsPrice = product.additionalIngredients
      .filter((ing) => selectedIngredients.has(ing.ingredientId))
      .reduce((sum, ing) => sum + ing.price, 0)

    return (selectedPortion.price + ingredientsPrice) * quantity
  }, [
    selectedPortion,
    selectedIngredients,
    quantity,
    product.additionalIngredients,
  ])

  const handleAddToCart = () => {
    onAddToCart({
      portionId: selectedPortion.portionId,
      temperatureId: selectedTemperature?.temperatureId || undefined,
      ingredientIds: product.additionalIngredients
        .filter((ing) => selectedIngredients.has(ing.ingredientId))
        .map((ing) => ing.ingredientId),
      quantity,
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.scrollableContent}>
        {/* Product Image */}
        <div className={styles.imageWrapper}>
          <ProductImage
            imgSrc={getImgUrl(product.image ?? undefined)}
            altText={product.name}
            temperatures={product.temperatures.map((t) => t.type)}
            isLg
            className={styles.productImage}
          />
        </div>

        {/* Product Name and Price */}
        <div className={styles.header}>
          <h2 className={styles.productName}>{product.name}</h2>
          <span className={styles.price}>{formatPrice(totalPrice)}</span>
        </div>

        {/* Portion Name */}
        <div className={styles.portionWeight}>{selectedPortion.name}</div>

        {/* Temperature Selection (if multiple) */}
        {product.temperatures.length > 1 && (
          <div className={styles.temperatureSelector}>
            {product.temperatures.map((temp) => (
              <button
                key={temp.temperatureId}
                className={classNames(
                  styles.temperatureButton,
                  selectedTemperature?.temperatureId === temp.temperatureId &&
                    styles.active
                )}
                onClick={() => setSelectedTemperature(temp)}
              >
                {temp.type === 'hot' ? (
                  <FireIcon className={styles.icon} />
                ) : (
                  <IceIcon className={styles.icon} />
                )}
                <span>
                  {temp.type === 'hot' ? t('product.hot') : t('product.cold')}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Description */}
        {product.description && (
          <p className={styles.description}>{product.description}</p>
        )}

        {/* Portion Selection (if multiple) */}
        {product.prices.length > 1 && (
          <TilesSelect
            className={styles.portionSelector}
            options={product.prices.map((x) => ({
              label: x.name,
              price: x.price,
              value: x.portionId.toString(),
            }))}
            onSelect={(newValues) => {
              setSelectedPortion(
                product.prices.find(
                  (x) => x.portionId.toString() === newValues[0]
                )!
              )
            }}
            value={[selectedPortion.portionId.toString()]}
          />
        )}

        {/* Additional Ingredients */}
        {product.additionalIngredients.length > 0 && (
          <div className={styles.ingredientsSection}>
            <h3 className={styles.subtitle}>{t('product.addons')}</h3>
            <TilesSelect
              isMulti
              options={product.additionalIngredients.map((x) => ({
                label: x.name,
                price: x.price,
                value: x.ingredientId.toString(),
              }))}
              onSelect={(newValues) =>
                setSelectedIngredients(new Set(newValues.map(Number)))
              }
              value={Array.from(selectedIngredients).map(String)}
            />
          </div>
        )}
      </div>

      <div className={styles.footer}>
        {/* Quantity Selector */}
        <QuantitySelector
          className={styles.quantitySection}
          quantity={quantity}
          onChange={(newQuant) => setQuantity(Math.max(1, quantity + newQuant))}
        />

        {/* Add to Cart Button */}
        <Button
          text={t('product.addToCart')}
          mode="orange"
          onClick={handleAddToCart}
          className={styles.addButton}
        />
      </div>
    </div>
  )
}

export default ProductSelectionModal
