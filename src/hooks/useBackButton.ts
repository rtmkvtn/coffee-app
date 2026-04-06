import { useCallback, useEffect, useState } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import { HOME_PATH, ORDERS_PATH } from '@constants/routes'

type BackButtonConfig = {
  show: boolean
  target: string
}

const getBackButtonConfig = (pathname: string): BackButtonConfig => {
  if (pathname === '/menu') return { show: true, target: HOME_PATH }
  if (pathname === '/orders') return { show: true, target: HOME_PATH }
  if (
    pathname.startsWith('/order/') &&
    pathname !== '/order-success' &&
    !pathname.startsWith('/orders')
  )
    return { show: true, target: ORDERS_PATH }
  return { show: false, target: '' }
}

export function useBackButton() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const tg = window.Telegram?.WebApp
  const config = getBackButtonConfig(pathname)

  const [devFallback, setDevFallback] = useState(false)

  const handleBack = useCallback(() => {
    if (config.target) {
      navigate(config.target)
    }
  }, [config.target, navigate])

  useEffect(() => {
    if (tg?.BackButton) {
      if (config.show) {
        tg.BackButton.show()
        tg.BackButton.onClick(handleBack)
      } else {
        tg.BackButton.hide()
      }

      return () => {
        tg.BackButton.offClick(handleBack)
      }
    } else {
      setDevFallback(config.show)
    }
  }, [pathname, config.show, handleBack, tg])

  return { showDevFallback: devFallback, onDevBack: handleBack }
}
