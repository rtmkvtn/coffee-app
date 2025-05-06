import classNames from 'classnames'

import styles from './GlobalLoader.module.scss'

type IProps = {
  className?: string
}

const GlobalLoader = ({ className }: IProps) => {
  return (
    <div className={classNames(styles.wrapper, className && className)}>
      <div className={styles.img} />
    </div>
  )
}

export default GlobalLoader
