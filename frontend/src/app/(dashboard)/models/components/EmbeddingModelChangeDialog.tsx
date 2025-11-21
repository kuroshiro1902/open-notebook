'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ExternalLink } from 'lucide-react'
import { useTranslations } from '@/lib/hooks/use-language'

interface EmbeddingModelChangeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  oldModelName?: string
  newModelName?: string
}

export function EmbeddingModelChangeDialog({
  open,
  onOpenChange,
  onConfirm,
  oldModelName,
  newModelName,
}: EmbeddingModelChangeDialogProps) {
  const router = useRouter()
  const [isConfirming, setIsConfirming] = useState(false)
  const t = useTranslations('models.embeddingDialog')

  const handleConfirmAndRebuild = () => {
    setIsConfirming(true)
    onConfirm()
    setTimeout(() => {
      router.push('/advanced')
      onOpenChange(false)
      setIsConfirming(false)
    }, 500)
  }

  const handleConfirmOnly = () => {
    onConfirm()
    onOpenChange(false)
  }

  const changeSummary =
    oldModelName && newModelName
      ? t('changeFromTo')
          .replace('{old}', oldModelName)
          .replace('{new}', newModelName)
      : ''

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <AlertDialogTitle>{t('title')}</AlertDialogTitle>
          </div>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-base text-muted-foreground">
              <p>
                {t('descriptionIntro')}
                {changeSummary ? (
                  <>
                    {' '}
                    {changeSummary}
                  </>
                ) : null}
                .
              </p>

              <div className="bg-muted p-4 rounded-md space-y-2">
                <p className="font-semibold text-foreground">{t('warningTitle')}</p>
                <p className="text-sm">
                  {t('rebuildInfo')}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <p className="font-medium text-foreground">{t('listTitle')}</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>{t('listItems.first')}</li>
                  <li>{t('listItems.second')}</li>
                  <li>{t('listItems.third')}</li>
                  <li>{t('listItems.fourth')}</li>
                </ul>
              </div>

              <p className="text-sm font-medium text-foreground">
                {t('prompt')}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel disabled={isConfirming}>
            {t('cancel')}
          </AlertDialogCancel>
          <Button
            variant="outline"
            onClick={handleConfirmOnly}
            disabled={isConfirming}
          >
            {t('changeOnly')}
          </Button>
          <AlertDialogAction
            onClick={handleConfirmAndRebuild}
            disabled={isConfirming}
            className="bg-primary"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            {t('changeAndRebuild')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
