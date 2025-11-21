'use client'

import { useCallback } from 'react'

import { useLanguageContext } from '@/components/providers/LanguageProvider'
import type { Locale } from '@/i18n/config'

export function useLanguage() {
  const { locale, setLocale } = useLanguageContext()

  return {
    locale,
    setLocale,
  }
}

export function useTranslations(namespace?: string) {
  const { translate } = useLanguageContext()
  const prefix = namespace ? `${namespace}.` : ''

  return useCallback(
    (key: string, fallback?: string) => translate(`${prefix}${key}`, fallback),
    [translate, prefix]
  )
}

export function useMessages() {
  const { getMessages } = useLanguageContext()
  return getMessages()
}

export type { Locale }

