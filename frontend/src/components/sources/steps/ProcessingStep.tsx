"use client"

import { Control, Controller } from "react-hook-form"
import { FormSection } from "@/components/ui/form-section"
import { CheckboxList } from "@/components/ui/checkbox-list"
import { Checkbox } from "@/components/ui/checkbox"
import { Transformation } from "@/lib/types/transformations"
import { SettingsResponse } from "@/lib/types/api"

interface CreateSourceFormData {
  type: 'link' | 'upload' | 'text'
  title?: string
  url?: string
  content?: string
  file?: FileList | File
  notebooks?: string[]
  transformations?: string[]
  embed: boolean
  async_processing: boolean
}

interface ProcessingStepProps {
  control: Control<CreateSourceFormData>
  transformations: Transformation[]
  selectedTransformations: string[]
  onToggleTransformation: (transformationId: string) => void
  loading?: boolean
  settings?: SettingsResponse
}

export function ProcessingStep({
  control,
  transformations,
  selectedTransformations,
  onToggleTransformation,
  loading = false,
  settings
}: ProcessingStepProps) {
  const transformationItems = transformations.map((transformation) => ({
    id: transformation.id,
    title: transformation.title,
    description: transformation.description
  }))

  return (
    <div className="space-y-8">
      <FormSection
        title="Biến đổi (tùy chọn)"
        description="Áp dụng biến đổi AI để phân tích và trích xuất ý tưởng từ nội dung của bạn."
      >
        <CheckboxList
          items={transformationItems}
          selectedIds={selectedTransformations}
          onToggle={onToggleTransformation}
          loading={loading}
          emptyMessage="Không tìm thấy biến đổi."
        />
      </FormSection>

      <FormSection
        title="Cài đặt xử lý"
        description="Cấu hình cách nguồn của bạn sẽ được xử lý và lưu trữ."
      >
        <div className="space-y-4">
          {settings?.default_embedding_option === 'ask' && (
            <Controller
              control={control}
              name="embed"
              render={({ field }) => (
                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-md hover:bg-muted">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium block">Bật embedding cho tìm kiếm</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cho phép nguồn này được tìm thấy trong tìm kiếm vector và câu hỏi AI
                    </p>
                  </div>
                </label>
              )}
            />
          )}

          {settings?.default_embedding_option === 'always' && (
            <div className="p-3 rounded-md bg-primary/10 border border-primary/30">
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 bg-primary rounded-full mt-0.5 flex-shrink-0"></div>
                <div className="flex-1">
                  <span className="text-sm font-medium block text-primary">Embedding được bật tự động</span>
                  <p className="text-xs text-primary mt-1">
                    Cài đặt của bạn được cấu hình để luôn embedding nội dung cho tìm kiếm vector.
                    Bạn có thể thay đổi điều này trong <span className="font-medium">Cài đặt</span>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {settings?.default_embedding_option === 'never' && (
            <div className="p-3 rounded-md bg-muted border border-border">
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 bg-muted-foreground rounded-full mt-0.5 flex-shrink-0"></div>
                <div className="flex-1">
                  <span className="text-sm font-medium block text-foreground">Embedding bị vô hiệu hóa</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cài đặt của bạn được cấu hình để bỏ qua embedding. Tìm kiếm vector sẽ không khả dụng cho nguồn này.
                    Bạn có thể thay đổi điều này trong <span className="font-medium">Cài đặt</span>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </FormSection>
    </div>
  )
}
