'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { useSettings, useUpdateSettings } from '@/lib/hooks/use-settings'
import { useEffect, useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'

const settingsSchema = z.object({
  default_content_processing_engine_doc: z.enum(['auto', 'docling', 'simple']).optional(),
  default_content_processing_engine_url: z.enum(['auto', 'firecrawl', 'jina', 'simple']).optional(),
  default_embedding_option: z.enum(['ask', 'always', 'never']).optional(),
  auto_delete_files: z.enum(['yes', 'no']).optional(),
})

type SettingsFormData = z.infer<typeof settingsSchema>

export function SettingsForm() {
  const { data: settings, isLoading, error } = useSettings()
  const updateSettings = useUpdateSettings()
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [hasResetForm, setHasResetForm] = useState(false)
  
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty }
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      default_content_processing_engine_doc: undefined,
      default_content_processing_engine_url: undefined,
      default_embedding_option: undefined,
      auto_delete_files: undefined,
    }
  })


  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  useEffect(() => {
    if (settings && settings.default_content_processing_engine_doc && !hasResetForm) {
      const formData = {
        default_content_processing_engine_doc: settings.default_content_processing_engine_doc as 'auto' | 'docling' | 'simple',
        default_content_processing_engine_url: settings.default_content_processing_engine_url as 'auto' | 'firecrawl' | 'jina' | 'simple',
        default_embedding_option: settings.default_embedding_option as 'ask' | 'always' | 'never',
        auto_delete_files: settings.auto_delete_files as 'yes' | 'no',
      }
      reset(formData)
      setHasResetForm(true)
    }
  }, [hasResetForm, reset, settings])

  const onSubmit = async (data: SettingsFormData) => {
    await updateSettings.mutateAsync(data)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Không thể tải cấu hình</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : 'Đã xảy ra lỗi không mong muốn.'}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Xử lý nội dung</CardTitle>
          <CardDescription>
            Cấu hình cách xử lý văn bản và URL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="doc_engine">Mô hình xử lý văn bản</Label>
            <Controller
              name="default_content_processing_engine_doc"
              control={control}
              render={({ field }) => (
                <Select
                  key={field.value}
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  disabled={field.disabled || isLoading}
                >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn mô hình xử lý văn bản" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Tự động (Khuyến nghị)</SelectItem>
                      <SelectItem value="docling">Docling</SelectItem>
                      <SelectItem value="simple">Simple</SelectItem>
                    </SelectContent>
                  </Select>
              )}
            />
            <Collapsible open={expandedSections.doc} onOpenChange={() => toggleSection('doc')}>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${expandedSections.doc ? 'rotate-180' : ''}`} />
                Giúp tôi chọn
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 text-sm text-muted-foreground space-y-2">
                <p>• <strong>Docling</strong> là một mô hình chậm hơn nhưng chính xác hơn, đặc biệt nếu văn bản chứa bảng và hình ảnh.</p>
                <p>• <strong>Simple</strong> sẽ trích xuất nội dung từ văn bản mà không định dạng nó. Nó phù hợp với văn bản đơn giản, nhưng sẽ mất chất lượng trong văn bản phức tạp.</p>
                <p>• <strong>Tự động (khuyến nghị)</strong> sẽ cố gắng xử lý qua Docling và mặc định là Simple.</p>
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="url_engine">Mô hình xử lý URL</Label>
            <Controller
              name="default_content_processing_engine_url"
              control={control}
              render={({ field }) => (
                <Select
                  key={field.value}
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  disabled={field.disabled || isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn mô hình xử lý URL" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Tự động (Khuyến nghị)</SelectItem>
                    <SelectItem value="firecrawl">Firecrawl</SelectItem>
                    <SelectItem value="jina">Jina</SelectItem>
                    <SelectItem value="simple">Simple</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <Collapsible open={expandedSections.url} onOpenChange={() => toggleSection('url')}>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${expandedSections.url ? 'rotate-180' : ''}`} />
                Giúp tôi chọn
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 text-sm text-muted-foreground space-y-2">
                <p>• <strong>Firecrawl</strong> là một dịch vụ trả phí (với gói miễn phí), và rất mạnh mẽ.</p>
                <p>• <strong>Jina</strong> là một lựa chọn tốt và cũng có gói miễn phí.</p>
                <p>• <strong>Simple</strong> sẽ sử dụng trích xuất HTTP cơ bản và sẽ bỏ lỡ nội dung trên trang web dựa trên javascript.</p>
                <p>• <strong>Tự động (khuyến nghị)</strong> sẽ cố gắng sử dụng Firecrawl (nếu có API Key). Sau đó, nó sẽ sử dụng Jina cho đến khi đạt giới hạn (hoặc sẽ tiếp tục sử dụng Jina nếu bạn đã thiết lập API Key). Nó sẽ fallback đến Simple, khi không có các tùy chọn trước đó là khả dụng.</p>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Embedding và Tìm kiếm</CardTitle>
          <CardDescription>
            Cấu hình các tùy chọn tìm kiếm và embedding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="embedding">Tùy chọn embedding mặc định</Label>
            <Controller
              name="default_embedding_option"
              control={control}
              render={({ field }) => (
                <Select
                  key={field.value}
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  disabled={field.disabled || isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn tùy chọn embedding" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ask">Hỏi</SelectItem>
                    <SelectItem value="always">Luôn</SelectItem>
                    <SelectItem value="never">Không bao giờ</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <Collapsible open={expandedSections.embedding} onOpenChange={() => toggleSection('embedding')}>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${expandedSections.embedding ? 'rotate-180' : ''}`} />
                Giúp tôi chọn
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 text-sm text-muted-foreground space-y-2">
                <p>Embedding nội dung sẽ làm cho nó dễ dàng tìm kiếm bởi bạn và bởi các agent AI của bạn. Nếu bạn đang chạy một mô hình embedding local (Ollama, ví dụ), bạn không nên lo lắng về chi phí và chỉ embedding mọi thứ. Đối với các nhà cung cấp trực tuyến, bạn có thể cẩn thận chỉ khi bạn xử lý rất nhiều nội dung (như 100s văn bản trong một ngày).</p>
                <p>• Chọn <strong>luôn</strong> nếu bạn đang chạy một mô hình embedding local hoặc nếu thể tích nội dung của bạn không quá lớn</p>
                <p>• Chọn <strong>hỏi</strong> nếu bạn muốn quyết định mỗi lần</p>
                <p>• Chọn <strong>không bao giờ</strong> nếu bạn không quan tâm đến tìm kiếm vector hoặc không có nhà cung cấp embedding.</p>
                <p>Làm tài liệu tham khảo, OpenAI&apos;s text-embedding-3-small costs about 0.02 for 1 million tokens -- which is about 30 times the Wikipedia page for Earth. With Gemini API, Text Embedding 004 is free with a rate limit of 1500 requests per minute.</p>
                <p>Với Gemini API, Text Embedding 004 là miễn phí với giới hạn tốc độ 1500 yêu cầu mỗi phút.</p>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quản lý tệp</CardTitle>
          <CardDescription>
            Cấu hình xử lý và lưu trữ tệp và tệp
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="auto_delete">Xóa tệp tự động</Label>
            <Controller
              name="auto_delete_files"
              control={control}
              render={({ field }) => (
                <Select
                  key={field.value}
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  disabled={field.disabled || isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn tùy chọn xóa tự động" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Có</SelectItem>
                    <SelectItem value="no">Không</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <Collapsible open={expandedSections.files} onOpenChange={() => toggleSection('files')}>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${expandedSections.files ? 'rotate-180' : ''}`} />
                Giúp tôi chọn
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 text-sm text-muted-foreground space-y-2">
                <p>Một khi tệp của bạn đã được tải lên và xử lý, chúng không còn cần thiết nữa. Hầu hết người dùng nên cho phép CSBKMS xóa tệp tự động từ thư mục tải lên. Chọn <strong>không</strong>, CHỈ nếu bạn đang sử dụng Notebook làm vị trí lưu trữ chính cho những tệp đó (mà bạn không nên làm điều đó). Tùy chọn này sẽ sớm bị phục vụ bằng cách luôn tải xuống các tệp.</p>
                <p>• Chọn <strong>có</strong> (khuyến nghị) để xóa tệp tự động sau khi xử lý</p>
                <p>• Chọn <strong>không</strong> chỉ khi bạn cần giữ nguyên tệp gốc trong thư mục tải lên</p>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={!isDirty || updateSettings.isPending}
        >
          {updateSettings.isPending ? 'Đang lưu...' : 'Lưu cấu hình'}
        </Button>
      </div>
    </form>
  )
}
