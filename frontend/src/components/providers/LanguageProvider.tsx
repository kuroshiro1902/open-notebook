'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  defaultLocale,
  isLocale,
  Locale,
  messages,
  TranslationMessages,
} from '@/i18n/config'
import { getMessage } from '@/i18n/utils'

type LanguageContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  translate: (key: string, fallback?: string) => string
  getMessages: () => TranslationMessages
}

const STORAGE_KEY = 'open-notebook:locale'

const noop = () => {}

export const LanguageContext = createContext<LanguageContextValue>({
  locale: defaultLocale,
  setLocale: noop,
  translate: (key) => key,
  getMessages: () => messages[defaultLocale],
})

type LanguageProviderProps = {
  children: React.ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const storedLocale = window.localStorage.getItem(STORAGE_KEY)
    if (storedLocale && isLocale(storedLocale)) {
      setLocaleState(storedLocale)
    }
  }, [])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, locale)
    }
  }, [locale])

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale)
  }, [])

  const translate = useCallback(
    (key: string, fallback?: string) => {
      const message = getMessage(messages[locale], key)

      if (typeof message === 'string') {
        return message
      }

      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[i18n] Missing translation for key "${key}" in locale "${locale}"`)
      }

      return fallback ?? key
    },
    [locale]
  )

  const getMessages = useCallback(() => messages[locale], [locale])

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      translate,
      getMessages,
    }),
    [locale, setLocale, translate, getMessages]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguageContext() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageProvider')
  }

  return context
}

