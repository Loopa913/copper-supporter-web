"use client";

import { useState, useTransition } from "react";
import { Loader2, Save, Check, Plus, Trash2, GripVertical } from "lucide-react";
import type { HomeContent } from "@/lib/cms/types";
import type { Supporter } from "@/lib/data/home";
import { updateSiteContent } from "@/app/admin/actions";
import { SoftCard } from "@/components/ui/SoftCard";
import { cn } from "@/lib/utils/cn";

type SupporterCmsEditorProps = {
  initialData: HomeContent;
  disabled?: boolean;
};

// 프로필 색상 옵션
const COLOR_OPTIONS = [
  { label: "카퍼", value: "bg-copper" },
  { label: "카퍼 다크", value: "bg-copper-dark" },
  { label: "블랙", value: "bg-text-primary" },
  { label: "그레이", value: "bg-text-secondary" },
];

export function SupporterCmsEditor({ initialData, disabled = false }: SupporterCmsEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [isSaved, setIsSaved] = useState(false);

  const [supporters, setSupporters] = useState<Supporter[]>(initialData.supporters);

  const handleAdd = () => {
    const newSupporter: Supporter = {
      id: crypto.randomUUID(),
      name: "새 멤버",
      role: "역할 입력",
      bio: "소개글을 입력하세요.",
      avatarColor: "bg-copper",
    };
    setSupporters([...supporters, newSupporter]);
  };

  const handleRemove = (id: string) => {
    setSupporters(supporters.filter((s) => s.id !== id));
  };

  const handleChange = (id: string, field: keyof Supporter, value: string) => {
    setSupporters(supporters.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleSave = () => {
    if (disabled) return;

    startTransition(async () => {
      try {
        await updateSiteContent("supporters", "list", JSON.stringify(supporters));
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
            참여 인원 (서포터즈) 관리
          </h2>
          <p className="mt-1 text-xs font-light text-text-muted">
            프로젝트에 참여하는 서포터즈 멤버 명단을 수정합니다.
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
        {supporters.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-text-muted">
            <p className="text-sm font-light">등록된 멤버가 없습니다.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {supporters.map((member) => (
              <div
                key={member.id}
                className="group relative flex gap-4 rounded-xl border border-border bg-white p-4 shadow-sm transition-colors hover:border-copper/30"
              >
                <div className="flex shrink-0 cursor-move items-center text-text-muted/50 transition-colors group-hover:text-text-muted">
                  <GripVertical className="h-5 w-5" />
                </div>
                
                <div className="flex-1 space-y-3 min-w-0">
                  <div className="flex gap-2">
                    <div className={cn("flex shrink-0 h-10 w-10 items-center justify-center rounded-full text-white font-semibold text-lg", member.avatarColor)}>
                      {member.name.charAt(0) || "?"}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleChange(member.id, "name", e.target.value)}
                        placeholder="이름"
                        className="w-full rounded-lg border border-border bg-surface-warm px-3 py-1.5 text-sm font-medium"
                      />
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => handleChange(member.id, "role", e.target.value)}
                        placeholder="역할 (예: 스트리머)"
                        className="w-full rounded-lg border border-border bg-surface-warm px-3 py-1.5 text-xs text-copper"
                      />
                    </div>
                  </div>
                  
                  <textarea
                    value={member.bio}
                    onChange={(e) => handleChange(member.id, "bio", e.target.value)}
                    placeholder="간단한 소개"
                    rows={2}
                    className="w-full resize-none rounded-lg border border-border bg-surface-warm px-3 py-1.5 text-sm font-light text-text-secondary"
                  />
                  
                  <select
                    value={member.avatarColor}
                    onChange={(e) => handleChange(member.id, "avatarColor", e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface-warm px-3 py-1.5 text-xs text-text-muted"
                  >
                    {COLOR_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        프로필 색상: {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(member.id)}
                  className="absolute right-2 top-2 p-1 text-red-400 opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
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
          onClick={handleAdd}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-4 text-sm font-medium text-text-secondary transition-colors hover:border-copper hover:bg-copper-muted hover:text-copper"
        >
          <Plus className="h-4 w-4" />
          새 멤버 추가
        </button>
      </div>
    </SoftCard>
  );
}
