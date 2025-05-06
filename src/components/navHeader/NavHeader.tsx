import { useNavigate } from 'react-router'

import classNames from 'classnames'

import Icon from '@assets/images/Icon'

import styles from './NavHeader.module.scss'

type IProps = {
  className?: string
  text?: string
}

const NavHeader = ({ className, text }: IProps) => {
  const navigate = useNavigate()

  return (
    <div className={classNames(styles.wrapper, className && className)}>
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
  )
}

export default NavHeader
