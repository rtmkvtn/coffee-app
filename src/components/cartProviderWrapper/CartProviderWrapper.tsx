import { ReactNode } from 'react'

import CartFooter from './cartFooter/CartFooter'
import styles from './CartProviderWrapper.module.scss'

type Props = {
  children: ReactNode
}

const CartProviderWrapper = ({ children }: Props) => {
  return (
    <div className={styles.wrapper}>
      {children}
      <CartFooter />
    </div>
  )
}

export default CartProviderWrapper
