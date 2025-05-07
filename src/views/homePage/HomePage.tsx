import { useNavigate } from 'react-router'

import Button from '@components/button/Button'
import { MENU_PATH } from '@constants/routes'
import { useStore } from '@context/mainContext'
import { getGreeting } from '@views/homePage/homePage.helpers'

import Icon from '@assets/images/Icon'

import styles from './HomePage.module.scss'

const HomePage = () => {
  const navigate = useNavigate()
  const { user } = useStore()

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.greetingsText}>{getGreeting(user)}</h1>
      <Button
        text="Сделать заказ"
        mode="primary"
        icon={<Icon type="arrowRight" />}
        onClick={() => navigate(MENU_PATH)}
      />
    </div>
  )
}

export default HomePage
