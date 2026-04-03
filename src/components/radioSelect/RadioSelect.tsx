import styles from './RadioSelect.module.scss'

export type IRadioOption = {
  label: string
  value: string
  icon?: string
}

type IProps = {
  options: IRadioOption[]
  value: string
  onSelect: (value: string) => void
  className?: string
}

const RadioSelect = ({ options, value, onSelect, className }: IProps) => {
  return (
    <div className={`${styles.wrapper} ${className ?? ''}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={styles.option}
          onClick={() => onSelect(option.value)}
        >
          {option.icon && (
            <span className={styles.icon}>{option.icon}</span>
          )}
          <span className={styles.label}>{option.label}</span>
          <span className={styles.radioCircle}>
            {value === option.value && <span className={styles.radioDot} />}
          </span>
        </button>
      ))}
    </div>
  )
}

export default RadioSelect
