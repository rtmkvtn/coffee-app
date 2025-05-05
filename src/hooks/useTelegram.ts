import { useEffect, useState } from 'react'

type TelegramUser = {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  photo_url?: string
  is_premium?: boolean
}

export function useTelegram() {
  const [user, setUser] = useState<TelegramUser | null>(null)
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
    }
  }, [])

  return { tg, user, initData }
}
