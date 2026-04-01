export interface IUser {
  id: string
  telegramId: string
  username: string | null
  firstName: string | null
  lastName: string | null
  languageCode: string | null
  photoUrl: string | null
  isPremium: boolean
}
