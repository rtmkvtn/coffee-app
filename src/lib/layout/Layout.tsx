import { ReactNode, useEffect, useRef } from 'react'

import NavHeader from '@components/navHeader/NavHeader'
import classNames from 'classnames'

import styles from './Layout.module.scss'

type IProps = {
  withNavHeader?: boolean
  headerText?: string
  children: ReactNode
}

const Layout = ({ withNavHeader, headerText, children }: IProps) => {
  const headerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (withNavHeader && headerRef.current) {
      const height = headerRef.current.offsetHeight
      document.documentElement.style.setProperty(
        '--header-height',
        `${height}px`
      )
      // Scroll content to top when header height changes
      if (contentRef.current) {
        contentRef.current.scrollTop = 0
      }
    }
  }, [withNavHeader, headerRef])

  return (
    <div
      className={classNames(styles.wrapper, withNavHeader && styles.withHeader)}
    >
      {withNavHeader && (
        <div className={styles.header} ref={headerRef}>
          <NavHeader text={headerText} />
        </div>
      )}
      <div className={styles.content} ref={contentRef}>
        {children}
      </div>
    </div>
  )
}

export default Layout
