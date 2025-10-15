import { useNavigate } from 'react-router-dom'

import Button from '@components/button/Button'
import Icon from '@assets/images/Icon'
import { HOME_PATH } from '@constants/routes'

import styles from './NotFoundPage.module.scss'

const NotFoundPage = () => {
  const navigate = useNavigate()

  const handleNavigateHome = () => {
    navigate(HOME_PATH)
  }

  return (
    <div className={styles.wrapper}>
      <Icon type="notFound" width={160} height={160} className={styles.icon} />
      <h1 className={styles.title}>Страница не найдена</h1>
      <p className={styles.subtitle}>
        Мы не нашли страницу, которую вы искали. Попробуйте вернуться на
        главную.
      </p>
      <Button
        text="На главную"
        mode="primary"
        onClick={handleNavigateHome}
        className={styles.button}
      />
    </div>
  )
}

export default NotFoundPage
