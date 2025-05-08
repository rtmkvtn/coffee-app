import { formatPrice, getImgUrlFromStrapiMediaOrDefault } from '@lib/helpers'
import ResponsiveImgWrapper from '@lib/responsiveImgWrapper/ResponsiveImgWrapper'
import { IProduct } from '@models/index'

import styles from './MenuItem.module.scss'

type Props = {
  product: IProduct
  onAddToCart: (product: IProduct) => void
}

const MenuItem = ({ product, onAddToCart }: Props) => {
  return (
    <div className={styles.product}>
      <ResponsiveImgWrapper
        className={styles.avatar}
        orientation="square"
        borderRadius={10}
      >
        <img src={getImgUrlFromStrapiMediaOrDefault(product.avatar)} />
      </ResponsiveImgWrapper>
      <div className={styles.info}>
        <p className={styles.name}>{product.name}</p>
        <p className={styles.price}>{formatPrice(product.price)}</p>
        <button
          className={styles.addButton}
          onClick={() => onAddToCart(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  )
}

export default MenuItem
