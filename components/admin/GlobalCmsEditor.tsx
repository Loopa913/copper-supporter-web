"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import type { GlobalConfig } from "@/lib/cms/global-config";
import { SoftCard } from "@/components/ui/SoftCard";
import { updateSiteContent, updateSiteContentBatch } from "@/app/admin/actions";
import { ImageUpload } from "@/components/ui/ImageUpload";

export function GlobalCmsEditor({
  initialData,
  disabled,
}: {
  initialData: GlobalConfig;
  disabled: boolean;
}) {
  const [data, setData] = useState<GlobalConfig>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    setSaved(false);
    try {
      await updateSiteContentBatch([
        { section: "global", key: "logoUrl", value: data.logoUrl }
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save global config", error);
      alert("저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <SoftCard interactive={false} className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-text-primary">
            글로벌 설정 편집 (로고 등)
          </h2>
          <p className="mt-1 text-sm font-light text-text-secondary">
            상단 네비게이션 로고 등 공통적인 설정을 변경합니다.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={disabled || isSaving}
          className="btn-copper flex min-w-[100px] items-center justify-center gap-2"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            "저장됨"
          ) : (
            <>
              <Save className="h-4 w-4" />
              저장
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-text-secondary">네비게이션 상단 로고 이미지 (URL 또는 업로드) *미입력 시 기본 CP 텍스트</label>
          <ImageUpload
            value={data.logoUrl || ""}
            onChange={(url) => setData({ ...data, logoUrl: url })}
            disabled={disabled}
          />
        </div>
      </div>
    </SoftCard>
  );
}
