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
  return numPrice
    .toLocaleString('ru-RU', {
      currency: 'RUB',
      style: 'currency',
      currencyDisplay: 'symbol',
    })
    .replace('₽', ' ₽')
}
