import { ReactNode, useEffect, useRef } from 'react'

import CartProviderWrapper from '@components/cartProviderWrapper/CartProviderWrapper'
import NavHeader from '@components/navHeader/NavHeader'
import classNames from 'classnames'

import styles from './Layout.module.scss'
import { LayoutProvider } from './LayoutContext'

type IProps = {
  withNavHeader?: boolean
  headerText?: string
  noBackOption?: boolean
  withCartProvider?: boolean
  children: ReactNode
}

const Layout = ({
  withNavHeader,
  noBackOption,
  headerText,
  withCartProvider,
  children,
}: IProps) => {
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
    <LayoutProvider>
      <div
        className={classNames(
          styles.wrapper,
          withNavHeader && styles.withHeader
        )}
      >
        {withNavHeader && (
          <div className={styles.header} ref={headerRef}>
            <NavHeader text={headerText} noBackOption={noBackOption} />
          </div>
        )}
        <div className={styles.content} ref={contentRef}>
          {withCartProvider ? (
            <CartProviderWrapper>{children}</CartProviderWrapper>
          ) : (
            children
          )}
        </div>
      </div>
    </LayoutProvider>
  )
}

export default Layout
