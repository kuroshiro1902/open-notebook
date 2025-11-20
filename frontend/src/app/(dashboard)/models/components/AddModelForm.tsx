'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CreateModelRequest, ProviderAvailability } from '@/lib/types/models'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useCreateModel } from '@/lib/hooks/use-models'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface AddModelFormProps {
  modelType: 'language' | 'embedding' | 'text_to_speech' | 'speech_to_text'
  providers: ProviderAvailability
}

export function AddModelForm({ modelType, providers }: AddModelFormProps) {
  const [open, setOpen] = useState(false)
  const t = useTranslations()
  const createModel = useCreateModel()
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<CreateModelRequest>({
    defaultValues: {
      type: modelType
    }
  })

  // Get available providers that support this model type
  const availableProviders = providers.available.filter(provider =>
    providers.supported_types[provider]?.includes(modelType)
  )

  const onSubmit = async (data: CreateModelRequest) => {
    await createModel.mutateAsync(data)
    reset()
    setOpen(false)
  }

  const getModelTypeName = () => {
    return modelType.replace(/_/g, ' ')
  }

  const getModelPlaceholder = () => {
    switch (modelType) {
      case 'language':
        return 'e.g., gpt-5-mini, claude, gemini'
      case 'embedding':
        return 'e.g., text-embedding-3-small'
      case 'text_to_speech':
        return 'e.g., tts-gpt-4o-mini-tts, tts-1-hd'
      case 'speech_to_text':
        return 'e.g., whisper-1'
      default:
        return 'Enter model name'
    }
  }

  if (availableProviders.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        {t('models.addModelForm.noProviders', { type: getModelTypeName() })}
      </div>
    )
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
            {t('models.addModelForm.addModel')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
            <DialogTitle>{t('models.addModelForm.title', { type: getModelTypeName() })}</DialogTitle>
            <DialogDescription>
              {t('models.addModelForm.description', { type: getModelTypeName() })}
            </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
              <Label htmlFor="provider">{t('models.addModelForm.providerLabel')}</Label>
            <Select onValueChange={(value) => setValue('provider', value)} required>
              <SelectTrigger>
                  <SelectValue placeholder={t('models.addModelForm.selectProviderPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {availableProviders.map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    <span className="capitalize">{provider}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.provider && (
                <p className="text-sm text-destructive mt-1">{t('models.addModelForm.errors.providerRequired')}</p>
            )}
          </div>

          <div>
              <Label htmlFor="name">{t('models.addModelForm.modelNameLabel')}</Label>
            <Input
              id="name"
                {...register('name', { required: t('models.addModelForm.errors.modelRequired') })}
                placeholder={getModelPlaceholder()}
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
                {modelType === 'language' && watch('provider') === 'azure' &&
                  t('models.addModelForm.azureNote')}
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('models.addModelForm.cancel')}
            </Button>
            <Button type="submit" disabled={createModel.isPending}>
              {createModel.isPending ? t('models.addModelForm.adding') : t('models.addModelForm.addModel')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}