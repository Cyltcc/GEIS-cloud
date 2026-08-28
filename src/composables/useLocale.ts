import { computed } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import enUS from 'ant-design-vue/es/locale/en_US'
import { i18n, LOCALE_STORAGE_KEY, type SupportLocale } from '@/locales'

const antdLocaleMap = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

const dayjsLocaleMap: Record<SupportLocale, string> = {
  'zh-CN': 'zh-cn',
  'en-US': 'en',
}

export const applyLocale = (locale: SupportLocale) => {
  i18n.global.locale.value = locale
  dayjs.locale(dayjsLocaleMap[locale])
  localStorage.setItem(LOCALE_STORAGE_KEY, locale)
}

const current = i18n.global.locale.value as SupportLocale
applyLocale(current)

export const useLocale = () => {
  const locale = computed(() => i18n.global.locale.value as SupportLocale)
  const antLocale = computed(() => antdLocaleMap[locale.value])

  const setLocale = (nextLocale: SupportLocale) => {
    if (locale.value === nextLocale) return
    applyLocale(nextLocale)
  }

  return {
    locale,
    antLocale,
    setLocale,
  }
}

