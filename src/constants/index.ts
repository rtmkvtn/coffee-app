export * from './routes'
export * from './temp'

export const BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:1337'

export const EMOJI = {
  RAISING_HANDS: '\u{1F64C}',
  DOVE: '\u{1F54A}',
  CREDIT_CARD: '\u{1F4B3}',
  CASH: '\u{1F4B8}',
} as const

export const PAYMENT_METHODS = [
  {
    key: 'CARD',
    label: 'Картой при получении',
    emoji: EMOJI.CREDIT_CARD,
  },
  {
    key: 'CASH',
    label: 'Наличными при получении',
    emoji: EMOJI.CASH,
  },
]
