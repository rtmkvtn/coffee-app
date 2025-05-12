import React, { ButtonHTMLAttributes, FC, ReactNode } from 'react'

import BubbleLoader from '@components/loaders/bubbleLoader/BubbleLoader'
import classNames from 'classnames'

import styles from './Button.module.scss'

type IButtonMode = 'primary' | 'secondary' | 'success'
type IIndicatorColor = 'red' | 'green' | 'yellow'

type IProps = {
  text: string
  mode: IButtonMode
  icon?: ReactNode
  className?: string
  disabled?: boolean
  onClick?: () => void
  needToIsolate?: boolean
  loading?: boolean
  withIndicator?: boolean
  indicatorColor?: IIndicatorColor
} & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'disabled' | 'className' | 'size'
>

const Button: FC<IProps> = ({
  text,
  mode,
  icon,
  className,
  disabled,
  onClick,
  loading,
  needToIsolate,
  withIndicator,
  indicatorColor,
  ...props
}) => {
  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading || needToIsolate) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (onClick) {
      onClick()
    }
  }

  return (
    <button
      className={classNames(
        styles.btn,
        styles[mode],
        icon ? styles.withIcon : '',
        loading && styles.loading,
        withIndicator && styles.withIndicator,
        className && className
      )}
      disabled={disabled}
      onClick={handleOnClick}
      {...props}
    >
      {loading && <BubbleLoader className={styles.loader} />}
      {text}
      {icon && icon}
      {withIndicator && indicatorColor && (
        <span
          className={classNames(styles.indicator, styles[indicatorColor])}
        />
      )}
    </button>
  )
}

export default Button
