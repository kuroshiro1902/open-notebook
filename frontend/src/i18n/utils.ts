import type { TranslationMessages, TranslationValue } from './config'

export function getMessage(
  messages: TranslationMessages,
  key: string
): string | undefined {
  const segments = key.split('.').filter(Boolean)

  let current: TranslationValue | undefined = messages

  for (const segment of segments) {
    if (typeof current !== 'object' || current === null || !(segment in current)) {
      return undefined
    }

    current = (current as TranslationMessages)[segment]
  }

  return typeof current === 'string' ? current : undefined
}

