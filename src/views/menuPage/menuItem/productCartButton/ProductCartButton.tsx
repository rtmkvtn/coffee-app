import Button from '@components/button/Button'
import BubbleLoader from '@components/loaders/bubbleLoader/BubbleLoader'
import classNames from 'classnames'

import Icon from '@assets/images/Icon'

import styles from './ProductCartButton.module.scss'

type Props = {
  loading?: boolean
  onAddToCart: () => void
  onRemoveFromCart: () => void
  quantity?: number
  className?: string
}

const ProductCartButton = ({
  onRemoveFromCart,
  loading,
  onAddToCart,
  quantity,
  className,
}: Props) => {
  return (
    <div
      className={classNames(
        styles.wrapper,
        quantity && styles.withQuant,
        className && className
      )}
    >
      {quantity && quantity > 0 ? (
        <div className={styles.quantWrapper}>
          {loading && (
            <div className={styles.loadingOverlay}>
              <BubbleLoader className={styles.loading} />
            </div>
          )}
          <div
            className={classNames(styles.minus, styles.item)}
            onClick={onRemoveFromCart}
          >
            <Icon type={'cartRemove'} />
          </div>
          <div className={classNames(styles.quant, styles.item)}>
            <p className={styles.text}>{quantity}</p>{' '}
          </div>
          <div
            className={classNames(styles.plus, styles.item)}
            onClick={onAddToCart}
          >
            <Icon type={'cartAdd'} />
          </div>
        </div>
      ) : (
        <Button
          loading={loading}
          className={className}
          text=""
          icon={<Icon type="cartAdd" />}
          mode="primary"
          onClick={onAddToCart}
        />
      )}
    </div>
  )
}

export default ProductCartButton
