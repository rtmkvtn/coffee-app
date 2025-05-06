import { ReactNode } from 'react'

import NavHeader from '@components/navHeader/NavHeader'
import classNames from 'classnames'

import styles from './Layout.module.scss'

type IProps = {
  withNavHeader?: boolean
  headerText?: string
  children: ReactNode
}

const Layout = ({ withNavHeader, headerText, children }: IProps) => {
  return (
    <div
      className={classNames(styles.wrapper, withNavHeader && styles.withHeader)}
    >
      {withNavHeader && <NavHeader text={headerText} />}
      <div className={styles.content}>{children}</div>
    </div>
  )
}

export default Layout
