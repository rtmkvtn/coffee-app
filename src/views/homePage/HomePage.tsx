import Button from '@components/button/Button'
import { useTelegram } from '@hooks/useTelegram'
import { getGreeting } from '@views/homePage/homePage.helpers'

import Icon from '@assets/images/Icon'

import styles from './HomePage.module.scss'

const HomePage = () => {
  const { user } = useTelegram()

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.greetingsText}>{getGreeting(user)}</h1>
      <Button
        text="Сделать заказ"
        mode="primary"
        icon={<Icon type="arrowRight" />}
      />
    </div>
  )
}

export default HomePage
