"use client";

import { useState } from "react";
import { Loader2, Save, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
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
  const [expandedTab, setExpandedTab] = useState<string | null>("quality");

  async function handleSave() {
    setIsSaving(true);
    setSaved(false);
    try {
      await updateSiteContent("protocol", "processImageUrl", data.processImageUrl);
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

  function handleTabChange(tabKey: string, field: string, value: string) {
    const key = tabKey as ProtocolTabKey;
    setData((prev) => ({
      ...prev,
      tabs: {
        ...prev.tabs,
        [key]: { ...prev.tabs[key], [field]: value },
      },
    }));
  }

  function handleItemChange(tabKey: string, index: number, field: string, value: string) {
    const key = tabKey as ProtocolTabKey;
    setData((prev) => {
      const newItems = [...prev.tabs[key].items];
      newItems[index] = { ...newItems[index], [field]: value };
      return {
        ...prev,
        tabs: {
          ...prev.tabs,
          [key]: { ...prev.tabs[key], items: newItems },
        },
      };
    });
  }

  function addItem(tabKey: string) {
    const key = tabKey as ProtocolTabKey;
    setData((prev) => ({
      ...prev,
      tabs: {
        ...prev.tabs,
        [key]: {
          ...prev.tabs[key],
          items: [
            ...prev.tabs[key].items,
            { id: Math.random().toString(36).substring(2, 9), title: "", summary: "" },
          ],
        },
      },
    }));
  }

  function removeItem(tabKey: string, index: number) {
    const key = tabKey as ProtocolTabKey;
    setData((prev) => ({
      ...prev,
      tabs: {
        ...prev.tabs,
        [key]: {
          ...prev.tabs[key],
          items: prev.tabs[key].items.filter((_, i) => i !== index),
        },
      },
    }));
  }

  function handleDetailChange(tabKey: string, index: number, field: string, value: string) {
    const key = tabKey as ProtocolTabKey;
    setData((prev) => {
      const newDetails = [...prev.tabs[key].details];
      newDetails[index] = { ...newDetails[index], [field]: value };
      return {
        ...prev,
        tabs: {
          ...prev.tabs,
          [key]: { ...prev.tabs[key], details: newDetails },
        },
      };
    });
  }

  function addDetail(tabKey: string) {
    const key = tabKey as ProtocolTabKey;
    setData((prev) => ({
      ...prev,
      tabs: {
        ...prev.tabs,
        [key]: {
          ...prev.tabs[key],
          details: [
            ...prev.tabs[key].details,
            { id: Math.random().toString(36).substring(2, 9), title: "", body: "", imageHint: "" },
          ],
        },
      },
    }));
  }

  function removeDetail(tabKey: string, index: number) {
    const key = tabKey as ProtocolTabKey;
    setData((prev) => ({
      ...prev,
      tabs: {
        ...prev.tabs,
        [key]: {
          ...prev.tabs[key],
          details: prev.tabs[key].details.filter((_, i) => i !== index),
        },
      },
    }));
  }

  return (
    <SoftCard interactive={false} className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-text-primary">
            스트리머 지원 프로토콜 편집
          </h2>
          <p className="mt-1 text-sm font-light text-text-secondary">
            프로토콜 탭의 내용과 세부 항목들을 직관적으로 편집할 수 있습니다.
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
        {/* 프로세스 이미지 설정 추가 */}
        <div className="rounded-xl border border-border overflow-hidden bg-white p-4">
          <h3 className="text-sm font-semibold text-copper mb-4">상단 프로세스 이미지</h3>
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary">프로세스 이미지 URL</label>
            <div className="flex gap-3 items-start">
              {data.processImageUrl && (
                <div className="relative w-24 h-16 rounded overflow-hidden shrink-0 border border-border bg-black/5">
                  <img src={data.processImageUrl} alt="preview" className="object-cover w-full h-full" />
                </div>
              )}
              <input
                type="text"
                value={data.processImageUrl || ""}
                onChange={(e) => setData({ ...data, processImageUrl: e.target.value })}
                disabled={disabled}
                placeholder="https://..."
                className="input-field text-sm py-1.5 flex-1"
              />
            </div>
          </div>
        </div>

        {Object.entries(data.tabs).map(([tabKey, tab]) => (
          <div key={tabKey} className="rounded-xl border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedTab(expandedTab === tabKey ? null : tabKey)}
              className="flex w-full items-center justify-between bg-black/[0.02] px-4 py-3 hover:bg-black/[0.04]"
            >
              <h3 className="font-medium text-text-primary">{tab.label} ({tabKey})</h3>
              {expandedTab === tabKey ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            
            {expandedTab === tabKey && (
              <div className="p-4 space-y-8 bg-white">
                {/* 탭 기본 정보 */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-copper">기본 정보</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-text-secondary">탭 이름</label>
                      <input
                        type="text"
                        value={tab.label}
                        onChange={(e) => handleTabChange(tabKey, "label", e.target.value)}
                        disabled={disabled}
                        className="input-field text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-text-secondary">탭 설명</label>
                      <input
                        type="text"
                        value={tab.description}
                        onChange={(e) => handleTabChange(tabKey, "description", e.target.value)}
                        disabled={disabled}
                        className="input-field text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* 그리드 아이템 목록 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-copper">요약 항목 (그리드)</h4>
                    <button
                      type="button"
                      onClick={() => addItem(tabKey)}
                      disabled={disabled}
                      className="flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-copper"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      항목 추가
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {tab.items.map((item, index) => (
                      <div key={item.id} className="relative rounded-lg border border-border p-3">
                        <button
                          type="button"
                          onClick={() => removeItem(tabKey, index)}
                          disabled={disabled}
                          className="absolute right-2 top-2 rounded-md p-1 text-text-muted hover:bg-black/5 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <div className="space-y-2 pr-6">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase text-text-muted">제목</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => handleItemChange(tabKey, index, "title", e.target.value)}
                              disabled={disabled}
                              className="input-field text-sm py-1"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase text-text-muted">설명</label>
                            <input
                              type="text"
                              value={item.summary}
                              onChange={(e) => handleItemChange(tabKey, index, "summary", e.target.value)}
                              disabled={disabled}
                              className="input-field text-sm py-1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 아코디언 디테일 목록 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-copper">상세 내용 (아코디언)</h4>
                    <button
                      type="button"
                      onClick={() => addDetail(tabKey)}
                      disabled={disabled}
                      className="flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-copper"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      상세 추가
                    </button>
                  </div>
                  <div className="space-y-3">
                    {tab.details.map((detail, index) => (
                      <div key={detail.id} className="relative rounded-lg border border-border p-3">
                        <button
                          type="button"
                          onClick={() => removeDetail(tabKey, index)}
                          disabled={disabled}
                          className="absolute right-2 top-2 rounded-md p-1 text-text-muted hover:bg-black/5 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <div className="space-y-3 pr-6">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase text-text-muted">제목</label>
                            <input
                              type="text"
                              value={detail.title}
                              onChange={(e) => handleDetailChange(tabKey, index, "title", e.target.value)}
                              disabled={disabled}
                              className="input-field text-sm py-1"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase text-text-muted">본문</label>
                            <textarea
                              value={detail.body}
                              onChange={(e) => handleDetailChange(tabKey, index, "body", e.target.value)}
                              disabled={disabled}
                              className="input-field text-sm py-1 min-h-[60px] resize-y"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase text-text-muted">이미지 힌트 (선택)</label>
                            <input
                              type="text"
                              value={detail.imageHint || ""}
                              onChange={(e) => handleDetailChange(tabKey, index, "imageHint", e.target.value)}
                              disabled={disabled}
                              className="input-field text-sm py-1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>
    </SoftCard>
  );
}
