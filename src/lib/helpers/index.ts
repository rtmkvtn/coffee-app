import { BASE_URL } from '@constants/index'
import { IStrapiMedia } from '@models/media.model'

import placeholder from '@assets/images/common/logo-round.png'

export const getImgUrlFromStrapiMediaOrDefault = (
  mediaObject?: IStrapiMedia
) => {
  return mediaObject ? `${BASE_URL}${mediaObject.url}` : placeholder
}

export const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return numPrice.toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  })
}

export const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString)
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
    case 'waitingForPayment':
      return 'Ожидает оплаты'
    case 'paymentProcessing':
      return 'Обработка оплаты'
    case 'paid':
      return 'Оплачен'
    case 'completed':
      return 'Выполнен'
    case 'canceled':
      return 'Отменен'
    default:
      return status
  }
}
