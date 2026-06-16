"use client";

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
    targetTitle ||
    navItems.find((item) => item.slug === targetSlug)?.title ||
    "페이지를 선택하세요";

  const buttonLabel = label.trim() || resolvedTitle;

  function updateProps(next: Partial<typeof block.props>) {
    editor.updateBlock(block.id, {
      props: {
        ...block.props,
        ...next,
      },
    });
  }

  return (
    <div contentEditable={false} className="my-5 not-prose" data-content-type="none">
      <button
        type="button"
        onClick={() => {
          if (targetSlug) onNavigate(targetSlug);
        }}
        disabled={!targetSlug}
        className={cn(
          "inline-flex items-center justify-center rounded-full border border-copper/20 bg-copper px-6 py-3 text-sm font-medium text-white transition-all duration-300",
          targetSlug
            ? "hover:-translate-y-0.5 hover:bg-copper-dark hover:shadow-md"
            : "cursor-not-allowed opacity-60"
        )}
      >
        {buttonLabel}
      </button>

      {editable && (
        <div className="mt-3 space-y-2 rounded-xl border border-border bg-surface-warm p-3">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-text-secondary">버튼 문구</label>
            <input
              type="text"
              value={label}
              onChange={(event) => updateProps({ label: event.target.value })}
              placeholder="예: 세계관 소개 보기"
              className="input-field text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-text-secondary">이동할 위키 페이지</label>
            <select
              value={targetSlug}
              onChange={(event) => {
                const nextSlug = event.target.value;
                const nextTitle = navItems.find((item) => item.slug === nextSlug)?.title || "";
                updateProps({
                  targetSlug: nextSlug,
                  targetTitle: nextTitle,
                });
              }}
              className="input-field text-sm"
            >
              <option value="">페이지 선택</option>
              {navItems.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
