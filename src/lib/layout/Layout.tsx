import { ReactNode, useRef } from 'react'

import CartProviderWrapper from '@components/cartProviderWrapper/CartProviderWrapper'

import styles from './Layout.module.scss'
import { LayoutProvider } from './LayoutContext'

type IProps = {
  withCartProvider?: boolean
  children: ReactNode
}

const Layout = ({ withCartProvider, children }: IProps) => {
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <LayoutProvider>
      <div className={styles.wrapper}>
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
