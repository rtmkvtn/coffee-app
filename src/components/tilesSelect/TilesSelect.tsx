import { formatPrice } from '@lib/helpers'
import classNames from 'classnames'

import styles from './TilesSelect.module.scss'

export type ITileOption = {
  label: string
  value: string
  price?: number
  emoji?: string
  disabled?: boolean
}

type IProps = {
  options: ITileOption[]
  isMulti?: boolean
  onSelect: (value: string[]) => void
  value: string[]
  className?: string
  isBlue?: boolean
}

const TilesSelect = ({
  options,
  onSelect,
  isMulti,
  value,
  className,
  isBlue,
}: IProps) => {
  const handleSelect = (optionValue: string) => {
    if (isMulti) {
      onSelect(
        value.includes(optionValue)
          ? value.filter((v) => v !== optionValue)
          : [...value, optionValue]
      )
    } else {
      if (!value.includes(optionValue)) {
        onSelect([optionValue])
      }
    }
  }

  return (
    <div
      className={classNames(
        styles.tileSelectWrapper,
        isBlue && styles.blueTiles,
        className && className
      )}
    >
      {options.map(
        ({ label, value: optionValue, price, emoji, disabled }, i) => (
          <div
            className={classNames(
              styles.optionItem,
              disabled && styles.disabled,
              value.includes(optionValue) && styles.selected
            )}
            key={`${optionValue}-${i}`}
            onClick={() => {
              if (!disabled) {
                handleSelect(optionValue)
              }
            }}
          >
            <div className={styles.checkbox} />
            <p className={styles.label}>
              {emoji ? `${emoji} ` : ''}
              {label}
            </p>
            {price && <p className={styles.price}>{formatPrice(price)}</p>}
          </div>
        )
      )}
    </div>
  )
}
export default TilesSelect
