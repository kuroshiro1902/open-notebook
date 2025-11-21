import en from './messages/en'
import vi from './messages/vi'

export const locales = ['en', 'vi'] as const

export type Locale = typeof locales[number]

export const defaultLocale: Locale = 'en'

export const messages = {
  en,
  vi,
} satisfies Record<Locale, TranslationMessages>

export type TranslationValue = string | TranslationMessages

export type TranslationMessages = Record<string, TranslationValue>

export function isLocale(input: string): input is Locale {
  return (locales as readonly string[]).includes(input)
}

