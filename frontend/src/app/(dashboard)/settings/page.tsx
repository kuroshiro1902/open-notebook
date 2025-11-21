'use client'

import { AppShell } from '@/components/layout/AppShell'
import { SettingsForm } from './components/SettingsForm'
import { useSettings } from '@/lib/hooks/use-settings'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { useTranslations } from '@/lib/hooks/use-language'

export default function SettingsPage() {
  const { refetch } = useSettings()
  const t = useTranslations('settings.page')

  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-2xl font-bold">{t('title')}</h1>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                aria-label={t('refreshAria')}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <SettingsForm />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
