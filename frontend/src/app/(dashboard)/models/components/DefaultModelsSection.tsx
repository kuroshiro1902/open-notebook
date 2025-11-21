'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ModelDefaults, Model } from '@/lib/types/models'
import { useUpdateModelDefaults } from '@/lib/hooks/use-models'
import { AlertCircle, X } from 'lucide-react'
import { EmbeddingModelChangeDialog } from './EmbeddingModelChangeDialog'
import { useTranslations } from '@/lib/hooks/use-language'

interface DefaultModelsSectionProps {
  models: Model[]
  defaults: ModelDefaults
}

interface DefaultConfig {
  key: keyof ModelDefaults
  translationKey: string
  modelType: 'language' | 'embedding' | 'text_to_speech' | 'speech_to_text'
  required?: boolean
}

const defaultConfigs: DefaultConfig[] = [
  {
    key: 'default_chat_model',
    translationKey: 'default_chat_model',
    modelType: 'language',
    required: true,
  },
  {
    key: 'default_transformation_model',
    translationKey: 'default_transformation_model',
    modelType: 'language',
    required: true,
  },
  {
    key: 'default_tools_model',
    translationKey: 'default_tools_model',
    modelType: 'language',
  },
  {
    key: 'large_context_model',
    translationKey: 'large_context_model',
    modelType: 'language',
  },
  {
    key: 'default_embedding_model',
    translationKey: 'default_embedding_model',
    modelType: 'embedding',
    required: true,
  },
  {
    key: 'default_text_to_speech_model',
    translationKey: 'default_text_to_speech_model',
    modelType: 'text_to_speech',
  },
  {
    key: 'default_speech_to_text_model',
    translationKey: 'default_speech_to_text_model',
    modelType: 'speech_to_text',
  },
]

export function DefaultModelsSection({ models, defaults }: DefaultModelsSectionProps) {
  const updateDefaults = useUpdateModelDefaults()
  const { setValue, watch } = useForm<ModelDefaults>({
    defaultValues: defaults,
  })

  const t = useTranslations('models.defaultAssignments')
  const tFields = useTranslations('models.defaultAssignments.fields')
  const tPlaceholders = useTranslations('models.defaultAssignments.placeholders')

  // State for embedding model change dialog
  const [showEmbeddingDialog, setShowEmbeddingDialog] = useState(false)
  const [pendingEmbeddingChange, setPendingEmbeddingChange] = useState<{
    key: keyof ModelDefaults
    value: string
    oldModelId?: string
    newModelId?: string
  } | null>(null)

  // Update form when defaults change
  useEffect(() => {
    if (defaults) {
      Object.entries(defaults).forEach(([key, value]) => {
        setValue(key as keyof ModelDefaults, value)
      })
    }
  }, [defaults, setValue])

  const handleChange = (key: keyof ModelDefaults, value: string) => {
    // Special handling for embedding model changes
    if (key === 'default_embedding_model') {
      const currentEmbeddingModel = defaults[key]

      // Only show dialog if there's an existing embedding model and it's changing
      if (currentEmbeddingModel && currentEmbeddingModel !== value) {
        setPendingEmbeddingChange({
          key,
          value,
          oldModelId: currentEmbeddingModel,
          newModelId: value,
        })
        setShowEmbeddingDialog(true)
        return
      }
    }

    // For all other changes or new embedding model assignment
    const newDefaults = { [key]: value || null }
    updateDefaults.mutate(newDefaults)
  }

  const handleConfirmEmbeddingChange = () => {
    if (pendingEmbeddingChange) {
      const newDefaults = {
        [pendingEmbeddingChange.key]: pendingEmbeddingChange.value || null,
      }
      updateDefaults.mutate(newDefaults)
      setPendingEmbeddingChange(null)
    }
  }

  const handleCancelEmbeddingChange = () => {
    setPendingEmbeddingChange(null)
    setShowEmbeddingDialog(false)
  }

  const getModelsForType = (type: 'language' | 'embedding' | 'text_to_speech' | 'speech_to_text') => {
    return models.filter(model => model.type === type)
  }

  const missingRequiredConfigs = defaultConfigs.filter(config => {
    if (!config.required) return false
    const value = defaults[config.key]
    if (!value) return true
    const modelsOfType = models.filter(m => m.type === config.modelType)
    return !modelsOfType.some(m => m.id === value)
  })

  const missingRequiredLabels = missingRequiredConfigs.map(config =>
    tFields(`${config.translationKey}.label`),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {missingRequiredLabels.length > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t('missingNotice').replace('{list}', missingRequiredLabels.join(', '))}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {defaultConfigs.map((config) => {
            const label = tFields(`${config.translationKey}.label`)
            const description = tFields(`${config.translationKey}.description`)
            const availableModels = getModelsForType(config.modelType)
            const currentValue = watch(config.key) || undefined

            const isValidModel = currentValue && availableModels.some(m => m.id === currentValue)

            const selectPlaceholder = config.required && !isValidModel && availableModels.length > 0
              ? tPlaceholders('requiredSelect')
              : tPlaceholders('select')

            return (
              <div key={config.key} className="space-y-2">
                <Label>
                  {label}
                  {config.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={currentValue || ''}
                    onValueChange={(value) => handleChange(config.key, value)}
                  >
                      <SelectTrigger className={
                      config.required && !isValidModel && availableModels.length > 0
                        ? 'border-destructive'
                        : ''
                    }>
                      <SelectValue placeholder={selectPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModels
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{model.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {model.provider}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {!config.required && currentValue && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleChange(config.key, '')}
                      className="h-10 w-10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            )
          })}
        </div>

        <div className="pt-4 border-t">
          <a
            href="https://github.com/lfnovo/open-notebook/blob/main/docs/features/ai-models.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            {t('link')}
          </a>
        </div>
      </CardContent>

      <EmbeddingModelChangeDialog
        open={showEmbeddingDialog}
        onOpenChange={(open) => {
          if (!open) {
            handleCancelEmbeddingChange()
          }
        }}
        onConfirm={handleConfirmEmbeddingChange}
        oldModelName={
          pendingEmbeddingChange?.oldModelId
            ? models.find(m => m.id === pendingEmbeddingChange.oldModelId)?.name
            : undefined
        }
        newModelName={
          pendingEmbeddingChange?.newModelId
            ? models.find(m => m.id === pendingEmbeddingChange.newModelId)?.name
            : undefined
        }
      />
    </Card>
  )
}
