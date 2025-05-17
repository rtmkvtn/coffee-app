import { useEffect, useState } from 'react'

import { DEFAULT_TG_USER, MOCK_INIT_DATA } from '@constants/temp'
import { ITelegramUser } from '@models/tgUser.model'

export function useTelegram() {
  const [user, setUser] = useState<ITelegramUser | null>(null)
  const [initData, setInitData] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const tg = window.Telegram?.WebApp

  useEffect(() => {
    const initialize = async () => {
      if (import.meta.env.MODE === 'development') {
        const params = new URLSearchParams()
        params.set('query_id', MOCK_INIT_DATA.query_id)
        params.set('user', JSON.stringify(MOCK_INIT_DATA.user))
        params.set('auth_date', MOCK_INIT_DATA.auth_date.toString())
        params.set('hash', MOCK_INIT_DATA.hash)

        setUser(DEFAULT_TG_USER)
        setInitData(params.toString())
        setIsReady(true)
        return
      }

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
