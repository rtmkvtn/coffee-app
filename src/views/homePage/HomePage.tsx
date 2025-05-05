import { useTelegram } from '@hooks/useTelegram'
import { getGreeting } from '@views/homePage/homePage.helpers'

import styles from './HomePage.module.scss'

const HomePage = () => {
  const { user } = useTelegram()

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.greetingsText}>{getGreeting(user)}</h1>
    </div>
  )
}

export default HomePage
