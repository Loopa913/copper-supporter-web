"use client";

import { useState } from "react";
import { Loader2, Save, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { ProtocolContent } from "@/lib/cms/protocol-content";
import { SoftCard } from "@/components/ui/SoftCard";
import { updateSiteContent } from "@/app/admin/actions";
import type { ProtocolTabKey } from "@/lib/data/protocol";
import { ImageUpload } from "@/components/ui/ImageUpload";

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
  const [expandedTab, setExpandedTab] = useState<string | null>("awareness");

  async function handleSave() {
    setIsSaving(true);
    setSaved(false);
    try {
      await updateSiteContent("protocol", "processImageUrl", data.processImageUrl);
      await updateSiteContent("protocol", "recruitingBoxText", data.recruitingBoxText);
      await updateSiteContent("protocol", "recruitingBoxLink", data.recruitingBoxLink);
      await updateSiteContent("protocol", "processSectionDescription", data.processSectionDescription);
      await updateSiteContent("protocol", "protocolSectionDescription", data.protocolSectionDescription);
      await updateSiteContent("protocol", "processTracks", data.processTracks);
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

  function addTrack() {
    setData((prev) => ({
      ...prev,
      processTracks: [
        ...prev.processTracks,
        { id: Math.random().toString(36).substring(2, 9), title: "", parentGroup: "", steps: [] },
      ],
    }));
  }

  function removeTrack(index: number) {
    setData((prev) => ({
      ...prev,
      processTracks: prev.processTracks.filter((_, i) => i !== index),
    }));
  }

  function handleTrackChange(index: number, field: "title" | "parentGroup", value: string) {
    setData((prev) => {
      const newTracks = [...prev.processTracks];
      newTracks[index] = { ...newTracks[index], [field]: value };
      return { ...prev, processTracks: newTracks };
    });
  }

  function addStep(trackIndex: number) {
    setData((prev) => {
      const newTracks = [...prev.processTracks];
      newTracks[trackIndex] = {
        ...newTracks[trackIndex],
        steps: [
          ...newTracks[trackIndex].steps,
          { id: Math.random().toString(36).substring(2, 9), title: "" }
        ]
      };
      return { ...prev, processTracks: newTracks };
    });
  }

  function removeStep(trackIndex: number, stepIndex: number) {
    setData((prev) => {
      const newTracks = [...prev.processTracks];
      newTracks[trackIndex] = {
        ...newTracks[trackIndex],
        steps: newTracks[trackIndex].steps.filter((_, i) => i !== stepIndex)
      };
      return { ...prev, processTracks: newTracks };
    });
  }

  function handleStepChange(trackIndex: number, stepIndex: number, value: string) {
    setData((prev) => {
      const newTracks = [...prev.processTracks];
      const newSteps = [...newTracks[trackIndex].steps];
      newSteps[stepIndex] = { ...newSteps[stepIndex], title: value };
      newTracks[trackIndex] = { ...newTracks[trackIndex], steps: newSteps };
      return { ...prev, processTracks: newTracks };
    });
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
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-4 rounded-xl border border-border bg-white p-4">
            <h3 className="text-sm font-semibold text-copper">프로젝트 프로세스 설명글</h3>
            <textarea
              value={data.processSectionDescription}
              onChange={(e) => setData({ ...data, processSectionDescription: e.target.value })}
              disabled={disabled}
              placeholder="스트리머 프로젝트와 함께하는 프로세스입니다."
              className="w-full rounded-lg border border-border bg-surface-warm px-3 py-2 text-sm font-light text-text-primary whitespace-pre-wrap resize-y min-h-[60px]"
            />
          </div>

          <div className="space-y-4 rounded-xl border border-border bg-white p-4">
            <h3 className="text-sm font-semibold text-copper">스트리머 지원 프로토콜 설명글</h3>
            <textarea
              value={data.protocolSectionDescription}
              onChange={(e) => setData({ ...data, protocolSectionDescription: e.target.value })}
              disabled={disabled}
              placeholder="필터 칩으로 카테고리를 선택하고, 아코디언에서 상세 내용을 확인하세요."
              className="w-full rounded-lg border border-border bg-surface-warm px-3 py-2 text-sm font-light text-text-primary whitespace-pre-wrap resize-y min-h-[60px]"
            />
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-white p-4">
          <h3 className="text-sm font-semibold text-copper">하단 간담회 이동 박스</h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary">안내 문구</label>
              <input
                type="text"
                value={data.recruitingBoxText}
                onChange={(e) => setData({ ...data, recruitingBoxText: e.target.value })}
                disabled={disabled}
                className="input-field text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary">클릭 시 이동할 링크 (선택)</label>
              <input
                type="text"
                value={data.recruitingBoxLink}
                onChange={(e) => setData({ ...data, recruitingBoxLink: e.target.value })}
                disabled={disabled}
                placeholder="https://..."
                className="input-field text-sm"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-copper">프로세스 다중 트랙 관리</h3>
            <button
              type="button"
              onClick={addTrack}
              disabled={disabled}
              className="flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-copper"
            >
              <Plus className="h-3.5 w-3.5" />
              트랙 추가
            </button>
          </div>
          <div className="space-y-4">
            {data.processTracks.map((track, tIdx) => (
              <div key={track.id} className="relative rounded-lg border border-border p-4 bg-surface-warm">
                <button
                  type="button"
                  onClick={() => removeTrack(tIdx)}
                  disabled={disabled}
                  className="absolute right-2 top-2 rounded-md p-1 text-text-muted hover:bg-black/5 hover:text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <div className="space-y-4 pr-6">
                  <div className="flex gap-2">
                    <div className="space-y-1 flex-1">
                      <label className="text-[10px] uppercase text-text-muted">상위 그룹명 (선택)</label>
                      <input
                        type="text"
                        value={track.parentGroup || ""}
                        onChange={(e) => handleTrackChange(tIdx, "parentGroup", e.target.value)}
                        disabled={disabled}
                        placeholder="예: 프로젝트 지원자"
                        className="input-field text-sm py-1 font-semibold"
                      />
                    </div>
                    <div className="space-y-1 flex-1">
                      <label className="text-[10px] uppercase text-text-muted">트랙 제목</label>
                      <input
                        type="text"
                        value={track.title}
                        onChange={(e) => handleTrackChange(tIdx, "title", e.target.value)}
                        disabled={disabled}
                        placeholder="예: 서포터즈"
                        className="input-field text-sm py-1 font-semibold text-copper"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pl-4 border-l-2 border-border/50">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase text-text-muted">상세 스텝 (카드)</label>
                      <button
                        type="button"
                        onClick={() => addStep(tIdx)}
                        disabled={disabled}
                        className="text-[10px] font-medium text-copper hover:underline"
                      >
                        + 스텝 추가
                      </button>
                    </div>
                    {track.steps.map((step, sIdx) => (
                      <div key={step.id} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => handleStepChange(tIdx, sIdx, e.target.value)}
                          disabled={disabled}
                          placeholder="스텝 내용 (예: 1. 튜토리얼 진행)"
                          className="input-field text-sm py-1 flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => removeStep(tIdx, sIdx)}
                          disabled={disabled}
                          className="p-1 text-text-muted hover:text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border overflow-hidden bg-white p-4">
          <h3 className="text-sm font-semibold text-copper mb-4">상단 프로세스 이미지 (URL 또는 업로드)</h3>
          <ImageUpload
            value={data.processImageUrl || ""}
            onChange={(url) => setData({ ...data, processImageUrl: url })}
            disabled={disabled}
          />
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
                            <ImageUpload
                              value={detail.imageHint || ""}
                              onChange={(url) => handleDetailChange(tabKey, index, "imageHint", url)}
                              disabled={disabled}
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
