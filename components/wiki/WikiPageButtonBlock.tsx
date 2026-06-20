"use client";

import { FileText, ChevronRight } from "lucide-react";
import { useWikiEditorContext } from "@/components/wiki/WikiEditorContext";
import { cn } from "@/lib/utils/cn";

type WikiPageButtonBlockProps = {
  block: {
    id: string;
    props: {
      label: string;
      targetSlug: string;
      targetTitle: string;
    };
  };
  editor: {
    updateBlock: (
      blockId: string,
      update: {
        props: {
          label: string;
          targetSlug: string;
          targetTitle: string;
        };
      }
    ) => void;
  };
};

export function WikiPageButtonBlock({ block, editor }: WikiPageButtonBlockProps) {
  const { navItems, onNavigate, editable } = useWikiEditorContext();
  const { label, targetSlug, targetTitle } = block.props;

  const resolvedTitle =
    targetTitle || navItems.find((item) => item.slug === targetSlug)?.title || "";

  const subtitle = label.trim();

  function updateProps(next: Partial<typeof block.props>) {
    editor.updateBlock(block.id, {
      props: {
        ...block.props,
        ...next,
      },
    });
  }

  return (
    <div contentEditable={false} className="my-3 not-prose w-full" data-content-type="none">
      <button
        type="button"
        onClick={() => {
          if (targetSlug) onNavigate(targetSlug);
        }}
        disabled={!targetSlug}
        className={cn(
          "group flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all duration-200",
          targetSlug
            ? "border-border/80 bg-[#F7F6F3] hover:border-copper/25 hover:bg-[#EFEEEA] hover:shadow-sm"
            : "cursor-not-allowed border-dashed border-border bg-surface-warm/60"
        )}
      >
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border",
            targetSlug
              ? "border-border/60 bg-white text-text-secondary group-hover:text-copper"
              : "border-border/40 bg-white/70 text-text-muted"
          )}
        >
          <FileText className="h-4 w-4" />
        </span>

        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "block break-words text-sm font-medium leading-snug tracking-tight",
              targetSlug ? "text-text-primary group-hover:text-copper" : "text-text-muted"
            )}
          >
            {resolvedTitle || "이동할 문서를 선택하세요"}
          </span>
          {targetSlug && subtitle && (
            <span className="mt-0.5 block break-words text-xs font-light leading-snug text-text-muted">
              {subtitle}
            </span>
          )}
          {targetSlug && !subtitle && (
            <span className="mt-0.5 block text-xs font-light text-text-muted">위키 문서</span>
          )}
        </span>

        {targetSlug && (
          <ChevronRight className="h-4 w-4 shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-copper" />
        )}
      </button>

      {editable && (
        <div className="mt-2 space-y-2 rounded-lg border border-dashed border-border/70 bg-white/80 p-3">
          <p className="text-[10px] font-medium text-text-muted">페이지 링크 설정 (관리자만 보임)</p>
          <select
            value={targetSlug}
            onChange={(event) => {
              const nextSlug = event.target.value;
              const nextTitle = navItems.find((item) => item.slug === nextSlug)?.title || "";
              updateProps({ targetSlug: nextSlug, targetTitle: nextTitle });
            }}
            className="input-field text-sm"
          >
            <option value="">이동할 문서 선택</option>
            {navItems.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.title}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={label}
            onChange={(event) => updateProps({ label: event.target.value })}
            placeholder="부가 설명 (선택, 예: 세계관 소개)"
            className="input-field text-sm"
          />
        </div>
      )}
    </div>
  );
}
