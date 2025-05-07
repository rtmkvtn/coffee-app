import { IUser } from '@models/user.model'

export function getGreeting(user: IUser | null): string {
  const hour = new Date().getHours()
  let greeting: string

  if (hour >= 8 && hour < 11) {
    greeting = 'Доброе утро'
  } else if (hour >= 11 && hour < 17) {
    greeting = 'Добрый день'
  } else {
    greeting = 'Добрый вечер'
  }

  return user?.firstName ? `${greeting},\n${user.firstName}` : greeting
}
