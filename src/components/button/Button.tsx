import classNames from 'classnames'

import styles from './Button.module.scss'

type IProps = {
  className?: string
  onClick?: () => void
  text: string
} & HTMLButtonElement

const Button = ({ className }: IProps) => {
  return (
    <div className={classNames(styles.wrapper, className && className)}></div>
  )
}

export default Button
