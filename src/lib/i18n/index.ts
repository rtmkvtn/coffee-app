import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

const basePath = import.meta.env.MODE === 'development' ? '' : '/web-app'
const localesVersion =
  typeof COMMIT_HASH !== 'undefined' && COMMIT_HASH ? COMMIT_HASH : 'dev'
const versionedBasePath = `${basePath}/locales/${localesVersion}`

void i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ru',
    lng: 'ru',
    supportedLngs: ['ru', 'en', 'zh'],
    defaultNS: 'common',
    ns: ['common'],
    load: 'currentOnly',
    backend: {
      loadPath: `${versionedBasePath}/{{lng}}/{{ns}}.json`,
    },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupQuerystring: 'lang',
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
  })

export default i18n
