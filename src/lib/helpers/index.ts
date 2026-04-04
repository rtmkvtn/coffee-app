import { BASE_URL } from '@constants/index'
import i18n from '@lib/i18n'

import placeholder from '@assets/images/common/logo-round.png'

export const getImgUrl = (
  mediaUrl?: string,
  variant: 'full' | 'thumb' = 'full'
) => {
  if (!mediaUrl) return placeholder
  if (variant === 'thumb') {
    const thumbUrl = mediaUrl.replace(/\.webp$/, '.thumb.webp')
    return `${BASE_URL}${thumbUrl}`
  }
  return `${BASE_URL}${mediaUrl}`
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
  const locale = i18n.language || 'ru'

  if (friendly) {
    // Check if it's today
    if (date.toDateString() === now.toDateString()) {
      return `${i18n.t('dates.today')}, ${date.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
      })}`
    }

    // Check if it's yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return `${i18n.t('dates.yesterday')}, ${date.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
      })}`
    }

    // If it's this year, show month name
    if (date.getFullYear() === now.getFullYear()) {
      return `${date.getDate()} ${date.toLocaleString(locale, { month: 'long' })}, ${date.toLocaleTimeString(
        locale,
        {
          hour: '2-digit',
          minute: '2-digit',
        }
      )}`
    }

    // For other years, show full date
    return date.toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Default format if friendly is false or not provided
  return date.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export { isSimpleProduct, getSimpleProductConfig } from './productUtils'
