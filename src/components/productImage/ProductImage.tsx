import { getTemperaturesImage } from '@components/productImage/helpers'
import ResponsiveImgWrapper from '@lib/responsiveImgWrapper/ResponsiveImgWrapper'
import { IProductTemperature } from '@models/product.model'
import classNames from 'classnames'

import styles from './ProductImage.module.scss'

type IProps = {
  className?: string
  imgSrc: string
  altText?: string
  isLg?: boolean
  temperatures: IProductTemperature[]
}

const ProductImage = ({
  className,
  imgSrc,
  altText,
  isLg,
  temperatures,
}: IProps) => {
  return (
    <div
      className={classNames(
        styles.wrapper,
        isLg && styles.lg,
        className && className
      )}
    >
      {temperatures.length > 0 ? (
        <div className={styles.tempIcon}>
          {getTemperaturesImage(temperatures)}
        </div>
      ) : null}
      <ResponsiveImgWrapper orientation="square" className={styles.imgWrapper}>
        <img src={imgSrc} alt={altText ?? ''} />
      </ResponsiveImgWrapper>
    </div>
  )
}

export default ProductImage
