import { useTranslation } from 'react-i18next'

import classNames from 'classnames'

import { useUser } from '@context/userContext'
import { Locale } from '@lib/helpers/locale'

import styles from './LanguageSelector.module.scss'

type LanguageCode = Locale

const LANGUAGE_OPTIONS: Array<{ code: LanguageCode; label: string }> = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'ENG' },
  { code: 'zh', label: '中文' },
]

type LanguageSelectorProps = {
  className?: string
}

const LanguageSelector = ({ className }: LanguageSelectorProps) => {
  const { i18n } = useTranslation()
  const { updateLanguage } = useUser()

  const resolvedLanguage = i18n.resolvedLanguage || i18n.language || 'en'
  const activeLanguage = resolvedLanguage.split('-')[0] as LanguageCode

  const handleChange = (code: LanguageCode) => {
    if (code === activeLanguage) {
      return
    }

    void i18n.changeLanguage(code)
    updateLanguage(code)
  }

  return (
    <div className={classNames(styles.wrapper, className)}>
      {LANGUAGE_OPTIONS.map(({ code, label }) => {
        const isActive = code === activeLanguage

        return (
          <button
            key={code}
            type="button"
            className={classNames(styles.item, isActive && styles.active)}
            onClick={() => handleChange(code)}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

export default LanguageSelector
