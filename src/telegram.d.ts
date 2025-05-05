export {}

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp
    }
  }

  interface TelegramWebApp {
    initData: string
    initDataUnsafe: {
      user?: TelegramUser
      auth_date?: string
      hash?: string
    }
    ready(): void
    sendData(data: string): void
    close(): void
    expand(): void
    isExpanded: boolean
    themeParams: Record<string, string>
    version: string
    platform: string
  }

  interface TelegramUser {
    id: number
    first_name: string
    last_name?: string
    username?: string
    language_code?: string
    photo_url?: string
    is_premium?: boolean
  }
}
