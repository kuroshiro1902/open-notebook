'use client'

import { useMemo } from 'react'
import { AlertCircle, Lightbulb, Loader2 } from 'lucide-react'

import { EpisodeProfilesPanel } from '@/components/podcasts/EpisodeProfilesPanel'
import { SpeakerProfilesPanel } from '@/components/podcasts/SpeakerProfilesPanel'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useEpisodeProfiles, useSpeakerProfiles } from '@/lib/hooks/use-podcasts'
import { useModels } from '@/lib/hooks/use-models'
import { Model } from '@/lib/types/models'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

function modelsByProvider(models: Model[], type: Model['type']) {
  return models
    .filter((model) => model.type === type)
    .reduce<Record<string, string[]>>((acc, model) => {
      if (!acc[model.provider]) {
        acc[model.provider] = []
      }
      acc[model.provider].push(model.name)
      return acc
    }, {})
}

export function TemplatesTab() {
  const {
    episodeProfiles,
    isLoading: loadingEpisodeProfiles,
    error: episodeProfilesError,
  } = useEpisodeProfiles()

  const {
    speakerProfiles,
    usage,
    isLoading: loadingSpeakerProfiles,
    error: speakerProfilesError,
  } = useSpeakerProfiles(episodeProfiles)

  const {
    data: models = [],
    isLoading: loadingModels,
    error: modelsError,
  } = useModels()

  const languageModelOptions = useMemo(
    () => modelsByProvider(models, 'language'),
    [models]
  )
  const ttsModelOptions = useMemo(
    () => modelsByProvider(models, 'text_to_speech'),
    [models]
  )

  const isLoading = loadingEpisodeProfiles || loadingSpeakerProfiles || loadingModels
  const hasError = episodeProfilesError || speakerProfilesError || modelsError

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Không gian mẫu</h2>
        <p className="text-sm text-muted-foreground">
          Xây dựng cấu hình bản phát và bản phát để tạo podcast nhanh chóng.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem 
          value="overview" 
          className="overflow-hidden rounded-xl border border-border bg-muted/40 px-4"
        >
          <AccordionTrigger className="gap-2 py-4 text-left text-sm font-semibold">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              Cách mẫu tạo podcast
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">
            <div className="space-y-4">
              <p className="text-muted-foreground/90">
                Mẫu chia quy trình podcast thành hai khối xây dựng lại có thể sử dụng lại. Trộn và khớp
                thêm mỗi khi bạn tạo bản phát mới.
              </p>

              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Bản phát đặt định dạng</h4>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Xác định số lượng đoạn và cách truyện kể</li>
                  <li>Chọn các mô hình ngôn ngữ được sử dụng cho bản phát, tóm tắt và viết sổ tay</li>
                  <li>Lưu bản phát mặc định để mỗi bản phát bắt đầu với một tiếng nói đồng đều</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Bản phát đưa giọng nói lời</h4>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Chọn nhà cung cấp và mô hình text-to-speech</li>
                  <li>Chụp nhân vật, nội dung và ghi chú phát âm cho mỗi bản phát</li>
                  <li>Sử dụng lại cùng giọng nói chủ hoặc khách trong các định dạng bản phát khác nhau</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Quy trình khuyến nghị</h4>
                <ol className="list-decimal space-y-1 pl-5">
                  <li>Tạo bản phát cho mỗi giọng bạn cần</li>
                  <li>Xây dựng bản phát tham chiếu những bản phát bằng tên</li>
                  <li>Tạo podcast bằng cách chọn bản phát phù hợp với truyện</li>
                </ol>
                <p className="text-xs text-muted-foreground/80">
                  Bản phát tham chiếu bản phát bằng tên, vì vậy bắt đầu với bản phát giúp tránh
                  gán giọng nói sau này.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {hasError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Không thể tải dữ liệu mẫu</AlertTitle>
          <AlertDescription>
            Đảm bảo API đang chạy và thử lại. Một số phần có thể không hoàn chỉnh.
          </AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <div className="flex items-center gap-3 rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Đang tải mẫu…
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <SpeakerProfilesPanel
            speakerProfiles={speakerProfiles}
            usage={usage}
            modelOptions={ttsModelOptions}
          />
          <EpisodeProfilesPanel
            episodeProfiles={episodeProfiles}
            speakerProfiles={speakerProfiles}
            modelOptions={languageModelOptions}
          />
        </div>
      )}
    </div>
  )
}
