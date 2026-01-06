import { useTranslation } from 'react-i18next'

import seagulImg from '@assets/images/common/seagull_question.png'

import styles from './EmptyCart.module.scss'

const EmptyCart = () => {
  const { t } = useTranslation('cart')

  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateIcon}>
        <img src={seagulImg} alt={t('empty.altText')} />
      </div>
      <h2 className={styles.emptyStateTitle}>{t('empty.title')}</h2>
      <p className={styles.emptyStateText}>{t('empty.description')}</p>
    </div>
  )
}

export default EmptyCart
