import ResponsiveImgWrapper from '@lib/responsiveImgWrapper/ResponsiveImgWrapper'
import classNames from 'classnames'

import styles from './ProductImage.module.scss'

type IProps = {
  className?: string
  imgSrc: string
  altText?: string
}

const ProductImage = ({ className, imgSrc, altText }: IProps) => {
  return (
    <div className={classNames(styles.wrapper, className && className)}>
      <ResponsiveImgWrapper orientation="square" className={styles.imgWrapper}>
        <img src={imgSrc} alt={altText ?? ''} />
      </ResponsiveImgWrapper>
    </div>
  )
}

export default ProductImage
