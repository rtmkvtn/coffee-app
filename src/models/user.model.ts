export interface IUser {
  id: number
  username: string
  email: string
  blocked: boolean
  telegramId: string
  firstName: string
  lastName?: string
  isPremium?: boolean
  languageCode: string
  photoUrl?: string
}
