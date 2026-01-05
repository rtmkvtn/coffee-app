import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Button from '@components/button/Button'
import { HOME_PATH } from '@constants/routes'

import Icon from '@assets/images/Icon'

import styles from './NotFoundPage.module.scss'

const NotFoundPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleNavigateHome = () => {
    navigate(HOME_PATH)
  }

  return (
    <div className={styles.wrapper}>
      <Icon type="notFound" width={160} height={160} className={styles.icon} />
      <h1 className={styles.title}>{t('notFound.title')}</h1>
      <p className={styles.subtitle}>{t('notFound.subtitle')}</p>
      <Button
        text={t('notFound.cta')}
        mode="primary"
        onClick={handleNavigateHome}
        className={styles.button}
      />
    </div>
  )
}

export default NotFoundPage
