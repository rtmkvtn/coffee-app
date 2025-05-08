import { ReactNode } from 'react'

import { useLocation } from 'react-router-dom'

import { HOME_PATH } from '@constants/routes'

import CartFooter from './cartFooter/CartFooter'
import styles from './CartProviderWrapper.module.scss'

type Props = {
  children: ReactNode
}

const CartProviderWrapper = ({ children }: Props) => {
  const location = useLocation()
  const isHomePage = location.pathname === HOME_PATH

  if (isHomePage) {
    return <>{children}</>
  }

  return (
    <div className={styles.wrapper}>
      {children}
      <CartFooter />
    </div>
  )
}

export default CartProviderWrapper
