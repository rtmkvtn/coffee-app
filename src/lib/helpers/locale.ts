/**
 * Supported locales in the app
 */
export type Locale = 'ru' | 'en' | 'zh'

/**
 * Default locale (fallback)
 */
export const DEFAULT_LOCALE: Locale = 'ru'

/**
 * Localized string structure from backend JSON fields
 */
export type LocalizedString = {
  ru: string
  en: string
  zh: string
}

/**
 * Get localized string from JSON field with fallback logic
 *
 * @param field - Localized field from backend (e.g., name_by_locale)
 * @param locale - Desired locale code
 * @returns Localized string, falling back to default locale if not found
 *
 * @example
 * const product = { name_by_locale: { ru: "Кофе", en: "Coffee", zh: "咖啡" } }
 * getLocalizedField(product.name_by_locale, 'en') // Returns "Coffee"
 * getLocalizedField(product.name_by_locale, 'ru') // Returns "Кофе"
 */
export function getLocalizedField(
  field: LocalizedString | undefined | null,
  locale: Locale = DEFAULT_LOCALE
): string {
  if (!field) return ''

  // Try requested locale first
  if (field[locale]) return field[locale]

  // Fallback to default locale
  if (field[DEFAULT_LOCALE]) return field[DEFAULT_LOCALE]

  // Last resort: return any available value
  return field.ru || field.en || field.zh || ''
}

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
