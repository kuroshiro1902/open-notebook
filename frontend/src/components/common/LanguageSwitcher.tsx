'use client'

import { Languages } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useLanguage, useTranslations } from '@/lib/hooks/use-language'
import type { Locale } from '@/i18n/config'
import { locales } from '@/i18n/config'

type LanguageSwitcherProps = {
  iconOnly?: boolean
}

export function LanguageSwitcher({ iconOnly = false }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage()
  const t = useTranslations('controls.language')

  const handleSelect = (nextLocale: Locale) => {
    setLocale(nextLocale)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={iconOnly ? 'ghost' : 'outline'}
          size={iconOnly ? 'icon' : 'default'}
          className={iconOnly ? 'h-9 w-full' : 'w-full justify-start gap-2'}
        >
          <Languages className="h-4 w-4" />
          {!iconOnly && <span>{t('label')}</span>}
          <span className="sr-only">{t('srLabel')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(locales as readonly Locale[]).map((optionLocale) => (
          <DropdownMenuItem
            key={optionLocale}
            onSelect={(event) => {
              event.preventDefault()
              handleSelect(optionLocale)
            }}
            className={cn(locale === optionLocale && 'bg-accent text-accent-foreground')}
          >
            <span>{t(`options.${optionLocale}`)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

