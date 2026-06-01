"use client";

import { useState, useTransition } from "react";
import { Loader2, Save, Check, Plus, Trash2, GripVertical } from "lucide-react";
import type { HomeContent } from "@/lib/cms/types";
import type { RoadmapEvent } from "@/lib/data/home";
import { updateSiteContent } from "@/app/admin/actions";
import { SoftCard } from "@/components/ui/SoftCard";
import { cn } from "@/lib/utils/cn";

type RoadmapCmsEditorProps = {
  initialData: HomeContent;
  disabled?: boolean;
};

export function RoadmapCmsEditor({ initialData, disabled = false }: RoadmapCmsEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [isSaved, setIsSaved] = useState(false);

  // 로컬 상태로 로드맵 배열 관리
  const [events, setEvents] = useState<RoadmapEvent[]>(initialData.roadmapEvents);

  const handleAddEvent = () => {
    const newEvent: RoadmapEvent = {
      id: crypto.randomUUID(), // 브라우저 내장 UUID 생성기
      date: "202X.XX.XX",
      title: "새로운 일정",
      description: "내용을 입력하세요.",
      status: "upcoming",
    };
    setEvents([...events, newEvent]);
  };

  const handleRemoveEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const handleChange = (id: string, field: keyof RoadmapEvent, value: string) => {
    setEvents(events.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const handleSave = () => {
    if (disabled) return;

    startTransition(async () => {
      try {
        // 객체나 배열은 JSON 형태로 문자열화해서 저장해야 데이터베이스에서 잘 인식합니다.
        await updateSiteContent("roadmap", "events", JSON.stringify(events));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      } catch (error) {
        console.error(error);
        alert("저장에 실패했습니다.");
      }
    });
  };

  return (
    <SoftCard interactive={false} className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-surface-warm px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-text-primary">
            로드맵 일정 관리
          </h2>
          <p className="mt-1 text-xs font-light text-text-muted">
            타임라인에 표시될 일정을 추가, 수정, 삭제합니다.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={disabled || isPending || isSaved}
          className={cn(
            "flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300",
            isSaved
              ? "bg-green-50 text-green-600"
              : "bg-copper text-white hover:bg-copper-dark",
            (disabled || isPending) && "cursor-not-allowed opacity-50"
          )}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isSaved ? (
            <Check className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaved ? "저장됨" : "저장"}
        </button>
      </div>

      <div className="p-6">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-text-muted">
            <p className="text-sm font-light">등록된 일정이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="group relative flex gap-4 rounded-xl border border-border bg-white p-4 shadow-sm transition-colors hover:border-copper/30"
              >
                <div className="flex shrink-0 cursor-move items-center text-text-muted/50 transition-colors group-hover:text-text-muted">
                  <GripVertical className="h-5 w-5" />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap gap-3 sm:flex-nowrap">
                    <input
                      type="text"
                      value={event.date}
                      onChange={(e) => handleChange(event.id, "date", e.target.value)}
                      placeholder="날짜 (예: 2024.10.15)"
                      className="w-full rounded-lg border border-border bg-surface-warm px-3 py-1.5 text-sm sm:w-32"
                    />
                    <input
                      type="text"
                      value={event.title}
                      onChange={(e) => handleChange(event.id, "title", e.target.value)}
                      placeholder="일정 제목"
                      className="w-full flex-1 rounded-lg border border-border bg-surface-warm px-3 py-1.5 text-sm font-medium"
                    />
                    <select
                      value={event.status}
                      onChange={(e) => handleChange(event.id, "status", e.target.value)}
                      className="w-full rounded-lg border border-border bg-surface-warm px-3 py-1.5 text-sm sm:w-28"
                    >
                      <option value="completed">완료됨</option>
                      <option value="current">진행중</option>
                      <option value="upcoming">예정됨</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={event.description}
                      onChange={(e) => handleChange(event.id, "description", e.target.value)}
                      placeholder="상세 내용"
                      className="flex-1 rounded-lg border border-border bg-surface-warm px-3 py-1.5 text-sm font-light text-text-secondary"
                    />
                    <input
                      type="text"
                      value={event.tag || ""}
                      onChange={(e) => handleChange(event.id, "tag", e.target.value)}
                      placeholder="태그 (선택)"
                      className="w-24 rounded-lg border border-border bg-surface-warm px-3 py-1.5 text-sm"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveEvent(event.id)}
                  className="flex shrink-0 items-start p-1 text-red-400 opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
                  title="삭제"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleAddEvent}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-4 text-sm font-medium text-text-secondary transition-colors hover:border-copper hover:bg-copper-muted hover:text-copper"
        >
          <Plus className="h-4 w-4" />
          새 일정 추가
        </button>
      </div>
    </SoftCard>
  );
}
