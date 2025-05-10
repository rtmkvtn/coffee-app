import React, { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import Button from '@components/button/Button'
import { MENU_PATH, ORDERS_PATH } from '@constants/routes'
import { useStore } from '@context/mainContext'
import { getGreeting } from '@views/homePage/homePage.helpers'

import Icon from '@assets/images/Icon'

import styles from './HomePage.module.scss'

const HomePage = () => {
  const navigate = useNavigate()
  const { user, orders } = useStore()

  const hasWaitingPayment = orders.some(
    (order) => order.state === 'waitingForPayment'
  )

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.greetingsText}>{getGreeting(user)}</h1>
      <Button
        text="Сделать заказ"
        mode="primary"
        icon={<Icon type="arrowRight" />}
        onClick={() => navigate(MENU_PATH)}
        className={styles.button}
      />
      <Button
        text="Мои заказы"
        mode="secondary"
        onClick={() => navigate(ORDERS_PATH)}
        className={styles.button}
        withIndicator={hasWaitingPayment}
        indicatorColor="yellow"
      />
    </div>
  )
}

export default HomePage
