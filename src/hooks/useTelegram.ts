import { useEffect, useState } from 'react'

import { DEFAULT_TG_USER } from '@constants/temp'
import { ITelegramUser } from '@models/tgUser.model'

export function useTelegram() {
  const [user, setUser] = useState<ITelegramUser | null>(null)
  const [initData, setInitData] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const tg = window.Telegram?.WebApp

  useEffect(() => {
    const initialize = async () => {
      if (tg) {
        try {
          await tg.ready() // ensure WebApp is initialized
          const unsafe = tg.initDataUnsafe
          if (unsafe?.user) {
            setUser(unsafe.user)
            setInitData(tg.initData) // raw query string, useful for backend verification
          }
        } catch (error) {
          console.error('Failed to initialize Telegram WebApp:', error)
          setUser(DEFAULT_TG_USER)
        }
      } else {
        console.warn('Telegram WebApp not available')
        setUser(DEFAULT_TG_USER)
      }
      setIsReady(true)
    }

    initialize()
  }, [])

  return { tg, user, initData, isReady }
}
