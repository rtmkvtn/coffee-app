export function getGreeting(user: TelegramUser | null): string {
  const hour = new Date().getHours()
  let greeting: string

  if (hour >= 8 && hour < 11) {
    greeting = 'Доброе утро'
  } else if (hour >= 11 && hour < 17) {
    greeting = 'Добрый день'
  } else {
    greeting = 'Добрый вечер'
  }

  return user?.first_name ? `${greeting},\n${user.first_name}` : greeting
}
