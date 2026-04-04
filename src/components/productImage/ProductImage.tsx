import { useState } from 'react'

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
  blurPlaceholder?: string | null
}

const ProductImage = ({
  className,
  imgSrc,
  altText,
  isLg,
  temperatures,
  blurPlaceholder,
}: IProps) => {
  const [loaded, setLoaded] = useState(false)

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
        {blurPlaceholder && !loaded && (
          <img
            src={blurPlaceholder}
            alt=""
            aria-hidden="true"
            className={styles.blurPlaceholder}
          />
        )}
        <img
          src={imgSrc}
          alt={altText ?? ''}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={classNames(styles.mainImage, !loaded && styles.loading)}
        />
      </ResponsiveImgWrapper>
    </div>
  )
}

export default ProductImage
