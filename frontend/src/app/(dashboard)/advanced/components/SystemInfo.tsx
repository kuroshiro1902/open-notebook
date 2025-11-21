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

        </div>
      </div>
    </Card>
  )
}
