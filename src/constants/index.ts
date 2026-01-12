export * from './routes'
export * from './temp'

export const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:1337'
    : 'https://cms.democoffeeandseaguls.ru'

export const EMOJI = {
  RAISING_HANDS: '\u{1F64C}',
  DOVE: '\u{1F54A}',
  CREDIT_CARD: '\u{1F4B3}',
  CASH: '\u{1F4B8}',
} as const

export const PAYMENT_METHODS = [
  {
    key: 'card',
    label: 'Картой при получении',
    emoji: EMOJI.CREDIT_CARD,
  },
  {
    key: 'cash',
    label: 'Наличными при получении',
    emoji: EMOJI.CASH,
  },
]
