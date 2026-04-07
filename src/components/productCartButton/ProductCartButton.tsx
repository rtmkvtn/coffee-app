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
        loading && styles.loading,
        className && className
      )}
    >
      <Button
        className={styles.minus}
        text=""
        icon={<Icon type="minus" />}
        isIconSized
        mode="orange"
        onClick={onRemoveFromCart}
      />
      <div className={styles.quant}>
        {loading ? <BubbleLoader /> : quantity}
      </div>
      <Button
        text=""
        className={styles.plus}
        icon={<Icon type="plus" />}
        isIconSized
        mode="orange"
        onClick={onAddToCart}
      />
    </div>
  )
}

export default ProductCartButton
