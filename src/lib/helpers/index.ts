import { BASE_URL } from '@constants/index'

import placeholder from '@assets/images/common/logo-round.png'

export const getImgUrl = (mediaUrl?: string) => {
  return mediaUrl ? `${BASE_URL}${mediaUrl}` : placeholder
}

export const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return numPrice.toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  })
}

export const formatDate = (dateString: string | Date, friendly?: boolean) => {
  const date = new Date(dateString)
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  if (friendly) {
    // Check if it's today
    if (date.toDateString() === now.toDateString()) {
      return `Сегодня, ${date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      })}`
    }

    // Check if it's yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return `Вчера, ${date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      })}`
    }

    // If it's this year, show month name
    if (date.getFullYear() === now.getFullYear()) {
      return `${date.getDate()} ${date.toLocaleString('ru-RU', { month: 'long' })}, ${date.toLocaleTimeString(
        'ru-RU',
        {
          hour: '2-digit',
          minute: '2-digit',
        }
      )}`
    }

    // For other years, show full date
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Default format if friendly is false or not provided
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const getOrderStatusText = (status: string) => {
  switch (status) {
    case 'draft':
      return 'Ожидает подтверждения'
    case 'waitingForPayment':
      return 'Ожидает оплаты'
    case 'paymentProcessing':
      return 'Обработка оплаты'
    case 'paid':
      return 'Оплачен'
    case 'preparing':
      return 'Готовится'
    case 'completed':
      return 'Выполнен'
    case 'canceled':
      return 'Отменен'
    default:
      return status
  }
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))
