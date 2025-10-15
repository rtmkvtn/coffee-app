import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Button from '@components/button/Button'
import LanguageSelector from '@components/languageSelector/LanguageSelector'
import { MENU_PATH, ORDERS_PATH } from '@constants/routes'
import { useOrders } from '@context/ordersContext'
import { useUser } from '@context/userContext'
import { getGreetingPeriod } from '@views/homePage/homePage.helpers'

import styles from './HomePage.module.scss'

const HomePage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user } = useUser()
  const { orders } = useOrders()

  const hasWaitingPayment = orders.some(
    (order) => order.state === 'waitingForPayment'
  )
  const greetingPeriod = getGreetingPeriod()

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.greetingsText}>
        {user?.firstName
          ? t(`home.greetings.${greetingPeriod}WithName`, {
              name: user.firstName,
            })
          : t(`home.greetings.${greetingPeriod}`)}
      </h1>
      <p className={styles.subtitleText}>{t('home.tagline')}</p>
      <Button
        text={t('home.makeOrder')}
        mode="primary"
        onClick={() => navigate(MENU_PATH)}
        className={styles.button}
      />
      <Button
        text={t('home.myOrders')}
        mode="secondary"
        onClick={() => navigate(ORDERS_PATH)}
        className={styles.button}
        withIndicator={hasWaitingPayment}
        indicatorColor="yellow"
      />
      <LanguageSelector />
    </div>
  )
}

export default HomePage
