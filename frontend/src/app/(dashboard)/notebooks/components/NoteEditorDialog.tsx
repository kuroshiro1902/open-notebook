'use client'

import { Controller, useForm, useWatch } from 'react-hook-form'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCreateNote, useUpdateNote, useNote } from '@/lib/hooks/use-notes'
import { QUERY_KEYS } from '@/lib/api/query-client'
import { MarkdownEditor } from '@/components/ui/markdown-editor'
import { InlineEdit } from '@/components/common/InlineEdit'
import { useTranslations } from 'next-intl'

const createNoteSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
})

type CreateNoteFormData = z.infer<typeof createNoteSchema>

interface NoteEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  notebookId: string
  note?: { id: string; title: string | null; content: string | null }
}

export function NoteEditorDialog({ open, onOpenChange, notebookId, note }: NoteEditorDialogProps) {
  const t = useTranslations()
  const createNote = useCreateNote()
  const updateNote = useUpdateNote()
  const queryClient = useQueryClient()
  const isEditing = Boolean(note)

  // Ensure note ID has 'note:' prefix for API calls
  const noteIdWithPrefix = note?.id
    ? (note.id.includes(':') ? note.id : `note:${note.id}`)
    : ''

  const { data: fetchedNote, isLoading: noteLoading } = useNote(noteIdWithPrefix, { enabled: open && !!note?.id })
  const isSaving = isEditing ? updateNote.isPending : createNote.isPending
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateNoteFormData>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  })
  const watchTitle = useWatch({ control, name: 'title' })

  useEffect(() => {
    if (!open) {
      reset({ title: '', content: '' })
      return
    }

    const source = fetchedNote ?? note
    const title = source?.title ?? ''
    const content = source?.content ?? ''

    reset({ title, content })
  }, [open, note, fetchedNote, reset])

  const onSubmit = async (data: CreateNoteFormData) => {
    if (note) {
      await updateNote.mutateAsync({
        id: noteIdWithPrefix,
        data: {
          title: data.title || undefined,
          content: data.content,
        },
      })
      // Only invalidate notebook-specific queries if we have a notebookId
      if (notebookId) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notes(notebookId) })
      }
    } else {
      // Creating a note requires a notebookId
      if (!notebookId) {
        console.error('Cannot create note without notebook_id')
        return
      }
      await createNote.mutateAsync({
        title: data.title || undefined,
        content: data.content,
        note_type: 'human',
        notebook_id: notebookId,
      })
    }
    reset()
    onOpenChange(false)
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl w-full max-h-[90vh] overflow-hidden p-0">
        <DialogTitle className="sr-only">
          {isEditing ? t('notebooks.noteEditor.title.edit') : t('notebooks.noteEditor.title.create')}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
            {isEditing && noteLoading ? (
            <div className="flex-1 flex items-center justify-center py-10">
              <span className="text-sm text-muted-foreground">{t('notebooks.noteEditor.loading')}</span>
            </div>
          ) : (
            <>
              <div className="border-b px-6 py-4">
                <InlineEdit
                  value={watchTitle ?? ''}
                  onSave={(value) => setValue('title', value || '')}
                  placeholder={t('notebooks.noteEditor.titlePlaceholder')}
                  emptyText={t('notebooks.noteEditor.titleEmpty')}
                  className="text-xl font-semibold"
                  inputClassName="text-xl font-semibold"
                />
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                <Controller
                  control={control}
                  name="content"
                  render={({ field }) => (
                    <MarkdownEditor
                      key={note?.id ?? 'new'}
                      value={field.value}
                      onChange={field.onChange}
                      height={420}
                      placeholder={t('notebooks.noteEditor.contentPlaceholder')}
                      className="rounded-md border"
                    />
                  )}
                />
                {errors.content && (
                  <p className="text-sm text-red-600 mt-1">{t('notebooks.noteEditor.errors.contentRequired')}</p>
                )}
              </div>
            </>
          )}

          <div className="border-t px-6 py-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              {t('notebooks.noteEditor.buttons.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={isSaving || (isEditing && noteLoading)}
            >
              {isSaving
                ? isEditing ? t('notebooks.noteEditor.buttons.saving') : t('notebooks.noteEditor.buttons.creating')
                : isEditing
                  ? t('notebooks.noteEditor.buttons.saveNote')
                  : t('notebooks.noteEditor.buttons.createNote')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
