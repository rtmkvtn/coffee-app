import { useEffect, useState } from 'react'

import { DEFAULT_TG_USER } from '@constants/temp'
import { ITelegramUser } from '@models/tgUser.model'

export function useTelegram() {
  const [user, setUser] = useState<ITelegramUser | null>(null)
  const [initData, setInitData] = useState<string | null>(null)
  const tg = window.Telegram?.WebApp

  useEffect(() => {
    if (tg) {
      tg.ready() // ensure WebApp is initialized
      const unsafe = tg.initDataUnsafe
      if (unsafe?.user) {
        setUser(unsafe.user)
        setInitData(tg.initData) // raw query string, useful for backend verification
      }
    } else {
      // error showing later
      setUser(DEFAULT_TG_USER)
    }
  }, [])

  return { tg, user, initData }
}
