export * from './routes'
export * from './temp'

export const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:1337'
    : 'https://cms.democoffeeandseaguls.ru'

export const PAYMENT_METHODS = [
  {
    key: 'card',
    label: 'Картой при получении',
    emoji: '\u{1F4B3}',
  },
  {
    key: 'cash',
    label: 'Наличными при получении',
    emoji: '\u{1F4B8}',
  },
]
