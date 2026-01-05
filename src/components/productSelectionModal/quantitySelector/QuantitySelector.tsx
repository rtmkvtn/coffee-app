import classNames from 'classnames'

import Icon from '@assets/images/Icon'

import styles from './QuantitySelector.module.scss'

type IProps = {
  quantity: number
  onChange: (quantity: number) => void
  className?: string
}
const QuantitySelector = ({ quantity, className, onChange }: IProps) => {
  return (
    <div
      className={classNames(
        styles.quantSelectorWrapper,
        className && className
      )}
    >
      <button
        className={classNames(
          styles.quantityButton,
          quantity <= 1 && styles.disabled
        )}
        onClick={() => onChange(-1)}
        disabled={quantity <= 1}
      >
        <Icon type="minus" size={20} />
      </button>
      <span className={styles.quantityValue}>{quantity}</span>
      <button className={styles.quantityButton} onClick={() => onChange(1)}>
        <Icon type="plus" size={20} />
      </button>
    </div>
  )
}
export default QuantitySelector
