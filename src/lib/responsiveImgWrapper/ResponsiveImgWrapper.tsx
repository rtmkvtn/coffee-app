import React from 'react'

import classNames from 'classnames'

import styles from './ResponsiveImgWrapper.module.scss'

type IProps = {
  className?: string
  orientation?: 'landscape' | 'portrait' | 'square'
  borderRadius?: number
  children: React.ReactNode
}
const ResponsiveImgWrapper = ({
  className,
  orientation = 'landscape',
  borderRadius,
  children,
}: IProps) => {
  return (
    <div
      className={classNames(
        styles.wrapper,
        className && className,
        styles[orientation]
      )}
      style={
        borderRadius
          ? {
              borderRadius: `${borderRadius}px`,
            }
          : {}
      }
    >
      {children}
    </div>
  )
}

export default ResponsiveImgWrapper
