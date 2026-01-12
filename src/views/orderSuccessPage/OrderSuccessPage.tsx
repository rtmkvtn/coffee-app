import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Button from '@components/button/Button'
import { EMOJI } from '@constants/index'
import { MENU_PATH, ORDERS_PATH } from '@constants/routes'

import seagullImage from '@assets/images/common/seagul-with-coffee.png'

import styles from './OrderSuccessPage.module.scss'

const OrderSuccessPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className={styles.wrapper}>
      <img
        src={seagullImage}
        alt={t('orderSuccess.imageAlt')}
        className={styles.image}
      />
      <h1 className={styles.title}>
        {t('orderSuccess.title')} {EMOJI.RAISING_HANDS}
      </h1>
      <p className={styles.text}>{t('orderSuccess.description')}</p>
      <p className={styles.text}>
        {t('orderSuccess.notification')} {EMOJI.DOVE}
      </p>
      <div className={styles.footer}>
        <Button
          text={t('orderSuccess.menuButton')}
          mode="primary"
          onClick={() => navigate(MENU_PATH)}
          className={styles.button}
        />
        <Button
          text={t('orderSuccess.ordersButton')}
          mode="secondary"
          onClick={() => navigate(ORDERS_PATH)}
          className={styles.button}
        />
      </div>
    </div>
  )
}

export default OrderSuccessPage
