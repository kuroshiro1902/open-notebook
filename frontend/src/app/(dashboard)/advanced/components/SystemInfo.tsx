'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { getConfig } from '@/lib/config'
import { Badge } from '@/components/ui/badge'
import { useTranslations } from 'next-intl'

export function SystemInfo() {
  const t = useTranslations()
  const [config, setConfig] = useState<{
    version: string
    latestVersion?: string | null
    hasUpdate?: boolean
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const cfg = await getConfig()
        setConfig(cfg)
      } catch (error) {
        console.error('Failed to load config:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadConfig()
  }, [])

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t('advanced.systemInfo.title')}</h2>
          <div className="text-sm text-muted-foreground">{t('advanced.systemInfo.loading')}</div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t('advanced.systemInfo.title')}</h2>

        <div className="space-y-3">
          {/* Current Version */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('advanced.systemInfo.currentVersion')}</span>
            <Badge variant="outline">{config?.version || t('advanced.systemInfo.unknown')}</Badge>
          </div>

          {/* Latest Version */}
          {config?.latestVersion && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('advanced.systemInfo.latestVersion')}</span>
              <Badge variant="outline">{config.latestVersion}</Badge>
            </div>
          )}

          {/* Update Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('advanced.systemInfo.statusLabel')}</span>
            {config?.hasUpdate ? (
              <Badge variant="destructive">
                {t('advanced.systemInfo.updateAvailable')}
              </Badge>
            ) : config?.latestVersion ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                {t('advanced.systemInfo.upToDate')}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                {t('advanced.systemInfo.unknown')}
              </Badge>
            )}
          </div>

          {/* Version Check Failed Message */}
          {!config?.latestVersion && config?.version && (
            <div className="pt-2 text-xs text-muted-foreground">
              {t('advanced.systemInfo.unableToCheck')}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
