import { useMemo, useState } from 'react'

import FireIcon from '@assets/images/common/fire.svg?react'
import IceIcon from '@assets/images/common/ice.svg?react'
import { useTranslation } from 'react-i18next'

import Button from '@components/button/Button'
import ProductImage from '@components/productImage/ProductImage'
import QuantitySelector from '@components/productSelectionModal/quantitySelector/QuantitySelector'
import TilesSelect from '@components/tilesSelect/TilesSelect'
import { formatPrice, getImgUrl } from '@lib/helpers'
import {
  LocalizedAdditionalIngredient,
  LocalizedPortion,
  LocalizedProduct,
} from '@models/index'
import { IProductTemperature } from '@models/product.model'
import classNames from 'classnames'

import styles from './ProductSelectionModal.module.scss'

interface ProductSelectionModalProps {
  product: LocalizedProduct
  onAddToCart: (config: {
    portion: LocalizedPortion
    temperature?: IProductTemperature
    additionalIngredients: LocalizedAdditionalIngredient[]
    quantity: number
  }) => void
}

const ProductSelectionModal = ({
  product,
  onAddToCart,
}: ProductSelectionModalProps) => {
  const { t } = useTranslation()

  const [selectedTemperature, setSelectedTemperature] =
    useState<IProductTemperature | null>(product.temperatures[0] || null)
  const [selectedPortion, setSelectedPortion] = useState<LocalizedPortion>(
    product.portions.reduce((smallest, current) =>
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
      .filter((ing) => selectedIngredients.has(ing.id))
      .reduce((sum, ing) => sum + ing.priceModifier, 0)

    return (selectedPortion.price + ingredientsPrice) * quantity
  }, [
    selectedPortion,
    selectedIngredients,
    quantity,
    product.additionalIngredients,
  ])

  const handleIngredientToggle = (ingredientId: number) => {
    const newSet = new Set(selectedIngredients)
    if (newSet.has(ingredientId)) {
      newSet.delete(ingredientId)
    } else {
      newSet.add(ingredientId)
    }
    setSelectedIngredients(newSet)
  }

  const handleAddToCart = () => {
    onAddToCart({
      portion: selectedPortion,
      temperature: selectedTemperature || undefined,
      additionalIngredients: product.additionalIngredients.filter((ing) =>
        selectedIngredients.has(ing.id)
      ),
      quantity,
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.scrollableContent}>
        {/* Product Image */}
        <div className={styles.imageWrapper}>
          <ProductImage
            imgSrc={getImgUrl(product.avatar)}
            altText={product.name}
            temperatures={product.temperatures}
            isLg
            className={styles.productImage}
          />
        </div>

        {/* Product Name and Price */}
        <div className={styles.header}>
          <h2 className={styles.productName}>{product.name}</h2>
          <span className={styles.price}>{formatPrice(totalPrice)}</span>
        </div>

        {/* Portion Weight */}
        <div className={styles.portionWeight}>{selectedPortion.weight}</div>

        {/* Temperature Selection (if multiple) */}
        {product.temperatures.length > 1 && (
          <div className={styles.temperatureSelector}>
            {product.temperatures.map((temp) => (
              <button
                key={temp}
                className={classNames(
                  styles.temperatureButton,
                  selectedTemperature === temp && styles.active
                )}
                onClick={() => setSelectedTemperature(temp)}
              >
                {temp === 'hot' ? (
                  <FireIcon className={styles.icon} />
                ) : (
                  <IceIcon className={styles.icon} />
                )}
                <span>
                  {temp === 'hot' ? t('product.hot') : t('product.cold')}
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
        {product.portions.length > 1 && (
          <TilesSelect
            className={styles.portionSelector}
            options={product.portions.map((x) => ({
              label: x.weight,
              price: x.price,
              value: x.weight,
            }))}
            onSelect={(newValues) => {
              setSelectedPortion(
                product.portions.find((x) => x.weight === newValues[0])!
              )
            }}
            value={[selectedPortion.weight]}
          />
        )}

        {/* Additional Ingredients */}
        {product.additionalIngredients.length > 0 && (
          <div className={styles.ingredientsSection}>
            {product.additionalIngredients.map((ingredient) => (
              <button
                key={ingredient.id}
                className={styles.ingredientItem}
                onClick={() => handleIngredientToggle(ingredient.id)}
              >
                <div className={styles.ingredientRadio}>
                  <div
                    className={classNames(
                      styles.radioCircle,
                      selectedIngredients.has(ingredient.id) && styles.selected
                    )}
                  />
                </div>
                <span className={styles.ingredientName}>{ingredient.name}</span>
                <span className={styles.ingredientPrice}>
                  {ingredient.priceModifier > 0 ? '+' : ''}
                  {formatPrice(ingredient.priceModifier)}
                </span>
              </button>
            ))}
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
