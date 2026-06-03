"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import type { ProtocolContent } from "@/lib/cms/protocol-content";
import { SoftCard } from "@/components/ui/SoftCard";
import { updateSiteContent } from "@/app/admin/actions";
import type { ProtocolTabKey } from "@/lib/data/protocol";

export function ProtocolCmsEditor({
  initialData,
  disabled,
}: {
  initialData: ProtocolContent;
  disabled: boolean;
}) {
  const [data, setData] = useState<ProtocolContent>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    setSaved(false);
    try {
      await updateSiteContent("protocol", "tabs", data.tabs);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save protocol content", error);
      alert("저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleJsonChange(value: string) {
    try {
      const parsed = JSON.parse(value);
      setData({ tabs: parsed });
    } catch (e) {
      // Allow invalid JSON while typing, but it will fail on save if it's not valid
    }
  }

  return (
    <SoftCard interactive={false} className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-text-primary">
            스트리머 지원 프로토콜 편집
          </h2>
          <p className="mt-1 text-sm font-light text-text-secondary">
            프로토콜 탭(퀄리티, 인지도 등)의 내용을 JSON 형식으로 직접 편집합니다.
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
        <textarea
          defaultValue={JSON.stringify(data.tabs, null, 2)}
          onChange={(e) => handleJsonChange(e.target.value)}
          disabled={disabled}
          className="input-field min-h-[400px] font-mono text-sm resize-y"
          spellCheck={false}
        />
        <p className="text-xs text-text-muted">
          * JSON 형식을 엄격하게 지켜주세요. 큰따옴표, 쉼표 누락 시 화면이 깨질 수 있습니다.
        </p>
      </div>
    </SoftCard>
  );
}
