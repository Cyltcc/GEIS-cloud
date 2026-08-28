import { createI18n } from 'vue-i18n'
import zhCN from './lang/zh-CN'
import enUS from './lang/en-US'

export const SUPPORT_LOCALES = ['zh-CN', 'en-US'] as const
export type SupportLocale = (typeof SUPPORT_LOCALES)[number]

export const LOCALE_STORAGE_KEY = 'app-locale'

const isSupportLocale = (locale: string): locale is SupportLocale =>
  SUPPORT_LOCALES.includes(locale as SupportLocale)

export const getBrowserLocale = (): SupportLocale => {
  const browserLocale = navigator.language || 'zh-CN'
  if (isSupportLocale(browserLocale)) return browserLocale
  if (browserLocale.toLowerCase().startsWith('zh')) return 'zh-CN'
  return 'en-US'
}

export const getStoredLocale = (): SupportLocale | null => {
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
  if (!stored) return null
  return isSupportLocale(stored) ? stored : null
}

export const getDefaultLocale = (): SupportLocale =>
  getStoredLocale() ?? getBrowserLocale()

export const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
})

