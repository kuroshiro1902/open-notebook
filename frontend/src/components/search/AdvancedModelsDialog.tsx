'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ModelSelector } from '@/components/common/ModelSelector'

interface AdvancedModelsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultModels: {
    strategy: string
    answer: string
    finalAnswer: string
  }
  onSave: (models: {
    strategy: string
    answer: string
    finalAnswer: string
  }) => void
}

export function AdvancedModelsDialog({
  open,
  onOpenChange,
  defaultModels,
  onSave
}: AdvancedModelsDialogProps) {
  const [strategyModel, setStrategyModel] = useState(defaultModels.strategy)
  const [answerModel, setAnswerModel] = useState(defaultModels.answer)
  const [finalAnswerModel, setFinalAnswerModel] = useState(defaultModels.finalAnswer)

  // Update local state when defaultModels change
  useEffect(() => {
    setStrategyModel(defaultModels.strategy)
    setAnswerModel(defaultModels.answer)
    setFinalAnswerModel(defaultModels.finalAnswer)
  }, [defaultModels])

  const handleSave = () => {
    onSave({
      strategy: strategyModel,
      answer: answerModel,
      finalAnswer: finalAnswerModel
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tùy chọn mô hình nâng cao</DialogTitle>
          <DialogDescription>
            Chọn mô hình cụ thể cho từng bước
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <ModelSelector
            label="Mô hình xử lý"
            modelType="language"
            value={strategyModel}
            onChange={setStrategyModel}
            placeholder="Chọn mô hình xử lý"
          />

          <ModelSelector
            label="Mô hình tạo câu trả lời"
            modelType="language"
            value={answerModel}
            onChange={setAnswerModel}
            placeholder="Chọn mô hình tạo câu trả lời"
          />

          <ModelSelector
            label="Mô hình trả lời"
            modelType="language"
            value={finalAnswerModel}
            onChange={setFinalAnswerModel}
            placeholder="Chọn mô hình trả lời"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave}>
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
