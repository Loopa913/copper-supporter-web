"use client";

import { useState, useTransition } from "react";
import { Loader2, Save, Check } from "lucide-react";
import type { HomeContent } from "@/lib/cms/types";
import { updateSiteContent } from "@/app/admin/actions";
import { SoftCard } from "@/components/ui/SoftCard";
import { cn } from "@/lib/utils/cn";

type HomeCmsEditorProps = {
  initialData: HomeContent;
  disabled?: boolean;
};

export function HomeCmsEditor({ initialData, disabled = false }: HomeCmsEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [savedSection, setSavedSection] = useState<string | null>(null);

  // 로컬 상태로 폼 데이터 관리
  const [formData, setFormData] = useState({
    tagline: initialData.tagline,
    heroSummary: initialData.heroSummary,
    videoId: initialData.videoId,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (section: string, key: string, value: string) => {
    if (disabled) return;

    startTransition(async () => {
      try {
        await updateSiteContent(section, key, value);
        // 저장 성공 피드백 표시
        setSavedSection(key);
        setTimeout(() => setSavedSection(null), 2000);
      } catch (error) {
        console.error(error);
        alert("저장에 실패했습니다.");
      }
    });
  };

  return (
    <SoftCard interactive={false} className="overflow-hidden">
      <div className="border-b border-border bg-surface-warm px-6 py-4">
        <h2 className="text-lg font-semibold tracking-tight text-text-primary">
          메인 화면 (Hero) 설정
        </h2>
        <p className="mt-1 text-xs font-light text-text-muted">
          웹사이트 첫 화면의 문구와 영상을 실시간으로 변경합니다.
        </p>
      </div>

      <div className="divide-y divide-border p-6">
        {/* 태그라인 */}
        <div className="pb-6">
          <label htmlFor="tagline" className="block text-sm font-medium text-text-primary">
            상단 태그라인
          </label>
          <div className="mt-2 flex gap-3">
            <input
              type="text"
              id="tagline"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              disabled={disabled || isPending}
              className="block w-full rounded-xl border border-border bg-surface-warm px-4 py-2 text-sm text-text-primary transition-colors focus:border-copper focus:bg-white focus:outline-none focus:ring-2 focus:ring-copper/20"
              placeholder="예: 함께 만드는 스트리머 프로젝트"
            />
            <SaveButton
              onClick={() => handleSave("hero", "tagline", formData.tagline)}
              isPending={isPending}
              isSaved={savedSection === "tagline"}
              disabled={disabled}
            />
          </div>
        </div>

        {/* 요약 문구 */}
        <div className="py-6">
          <label htmlFor="heroSummary" className="block text-sm font-medium text-text-primary">
            소개 요약
          </label>
          <div className="mt-2 flex gap-3">
            <textarea
              id="heroSummary"
              name="heroSummary"
              rows={3}
              value={formData.heroSummary}
              onChange={handleChange}
              disabled={disabled || isPending}
              className="block w-full resize-none rounded-xl border border-border bg-surface-warm px-4 py-3 text-sm leading-relaxed text-text-primary transition-colors focus:border-copper focus:bg-white focus:outline-none focus:ring-2 focus:ring-copper/20"
            />
            <SaveButton
              onClick={() => handleSave("hero", "summary", formData.heroSummary)}
              isPending={isPending}
              isSaved={savedSection === "summary"}
              disabled={disabled}
              className="h-auto"
            />
          </div>
        </div>

        {/* 유튜브 비디오 ID */}
        <div className="pt-6">
          <label htmlFor="videoId" className="block text-sm font-medium text-text-primary">
            유튜브 영상 ID
          </label>
          <p className="mt-1 text-xs text-text-muted">
            유튜브 링크의 v= 뒷부분 (예: https://www.youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong>)
          </p>
          <div className="mt-3 flex gap-3">
            <input
              type="text"
              id="videoId"
              name="videoId"
              value={formData.videoId}
              onChange={handleChange}
              disabled={disabled || isPending}
              className="block w-full rounded-xl border border-border bg-surface-warm px-4 py-2 text-sm text-text-primary transition-colors focus:border-copper focus:bg-white focus:outline-none focus:ring-2 focus:ring-copper/20"
            />
            <SaveButton
              onClick={() => handleSave("hero", "video_id", formData.videoId)}
              isPending={isPending}
              isSaved={savedSection === "video_id"}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </SoftCard>
  );
}

function SaveButton({
  onClick,
  isPending,
  isSaved,
  disabled,
  className,
}: {
  onClick: () => void;
  isPending: boolean;
  isSaved: boolean;
  disabled: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isPending || isSaved}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl px-4 text-sm font-medium transition-all duration-300",
        isSaved
          ? "bg-green-50 text-green-600"
          : "bg-copper text-white hover:bg-copper-dark",
        (disabled || isPending) && "opacity-50 cursor-not-allowed",
        className
      )}
      aria-label="저장"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isSaved ? (
        <Check className="h-4 w-4" />
      ) : (
        <Save className="h-4 w-4" />
      )}
    </button>
  );
}
