'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { getConfig } from '@/lib/config'
import { Badge } from '@/components/ui/badge'
import { useTranslations } from '@/lib/hooks/use-language'

export function SystemInfo() {
  const [config, setConfig] = useState<{
    version: string
    latestVersion?: string | null
    hasUpdate?: boolean
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const t = useTranslations('advanced.systemInfo')

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
          <h2 className="text-xl font-semibold">{t('title')}</h2>
          <div className="text-sm text-muted-foreground">{t('loading')}</div>
        </div>
      </Card>
    )
  }

  const statusBadge = () => {
    if (config?.hasUpdate) {
      return <Badge variant="destructive">{t('statusValues.updateAvailable')}</Badge>
    }

    if (config?.latestVersion) {
      return (
        <Badge variant="outline" className="text-green-600 border-green-600">
          {t('statusValues.upToDate')}
        </Badge>
      )
    }

    return (
      <Badge variant="outline" className="text-muted-foreground">
        {t('statusValues.unknown')}
      </Badge>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t('title')}</h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('currentVersion')}</span>
            <Badge variant="outline">{config?.version || t('statusValues.unknown')}</Badge>
          </div>

          {config?.latestVersion && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('latestVersion')}</span>
              <Badge variant="outline">{config.latestVersion}</Badge>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('status')}</span>
            {statusBadge()}
          </div>

          {config?.hasUpdate && (
            <div className="pt-2 border-t">
              <a
                href="https://github.com/lfnovo/open-notebook"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                {t('viewOnGithub')}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          )}

          {!config?.latestVersion && config?.version && (
            <div className="pt-2 text-xs text-muted-foreground">
              {t('updateCheckFailed')}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
