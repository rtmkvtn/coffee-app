import classNames from 'classnames'

import styles from './BubbleLoader.module.scss'

type IProps = {
  className?: string
}

const BubbleLoader = ({ className }: IProps) => {
  return (
    <div className={classNames(styles.bubbleLoader, className && className)} />
  )
}

export default BubbleLoader
