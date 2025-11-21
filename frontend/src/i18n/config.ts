import en from './messages/en'
import vi from './messages/vi'

export const locales = ['en', 'vi'] as const

export type Locale = typeof locales[number]

export const defaultLocale: Locale = 'vi'

export const messages = {
  en,
  vi,
} satisfies Record<Locale, TranslationMessages>

export interface TranslationMessages {
  [key: string]: TranslationValue
}

export type TranslationValue = string | TranslationMessages

export function isLocale(input: string): input is Locale {
  return (locales as readonly string[]).includes(input)
}

