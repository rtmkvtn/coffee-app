import { useStore } from '@context/mainContext'
import classNames from 'classnames'

import styles from './MenuPage.module.scss'

type IProps = {
  className?: string
}

const MenuPage = ({ className }: IProps) => {
  const { menu } = useStore()

  return (
    <div className={classNames(styles.wrapper, className && className)}></div>
  )
}

export default MenuPage
