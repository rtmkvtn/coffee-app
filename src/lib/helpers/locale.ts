/**
 * Supported locales in the app
 */
export type Locale = 'ru' | 'en' | 'zh'

/**
 * Default locale (fallback)
 */
export const DEFAULT_LOCALE: Locale = 'en'

/**
 * Check if a string is a valid locale code
 */
export function isValidLocale(locale: string): locale is Locale {
  return locale === 'ru' || locale === 'en' || locale === 'zh'
}

/**
 * Get current locale from i18n with fallback
 * Helper to extract locale code from language strings like 'en-US' -> 'en'
 */
export function normalizeLocale(language: string): Locale {
  const code = language.split('-')[0].toLowerCase()
  return isValidLocale(code) ? code : DEFAULT_LOCALE
}
