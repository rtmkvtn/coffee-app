import { forwardRef } from 'react'

import { useNavigate } from 'react-router'

import classNames from 'classnames'

import Icon from '@assets/images/Icon'

import styles from './NavHeader.module.scss'

type IProps = {
  className?: string
  text?: string
}

const NavHeader = forwardRef<HTMLDivElement, IProps>(
  ({ className, text }, ref) => {
    const navigate = useNavigate()

    return (
      <div
        ref={ref}
        className={classNames(styles.wrapper, className && className)}
      >
        <div className={styles.content}>
          <div
            className={styles.back}
            onClick={() => {
              navigate(-1)
            }}
          >
            <Icon type={'arrowRight'} size={24} />
          </div>
          {text && <p className={styles.text}>{text}</p>}
        </div>
      </div>
    )
  }
)

NavHeader.displayName = 'NavHeader'

export default NavHeader
