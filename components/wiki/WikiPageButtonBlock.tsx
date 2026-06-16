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
    targetTitle || navItems.find((item) => item.slug === targetSlug)?.title || "";

  const buttonLabel = label.trim() || resolvedTitle || "문서 보기";

  function updateProps(next: Partial<typeof block.props>) {
    editor.updateBlock(block.id, {
      props: {
        ...block.props,
        ...next,
      },
    });
  }

  return (
    <div contentEditable={false} className="my-6 not-prose" data-content-type="none">
      <button
        type="button"
        onClick={() => {
          if (targetSlug) onNavigate(targetSlug);
        }}
        disabled={!targetSlug}
        className={cn(
          "inline-flex items-center justify-center rounded-full border border-copper/20 px-8 py-3 text-sm font-medium transition-all duration-300",
          targetSlug
            ? "bg-copper text-white hover:-translate-y-0.5 hover:bg-copper-dark hover:shadow-md"
            : "cursor-not-allowed bg-copper/40 text-white/80"
        )}
      >
        {buttonLabel}
      </button>

      {editable && (
        <div className="mt-3 space-y-2 rounded-xl border border-dashed border-border bg-surface-warm/80 p-3">
          <p className="text-[10px] font-medium text-text-muted">버튼 설정 (관리자만 보임)</p>
          <input
            type="text"
            value={label}
            onChange={(event) => updateProps({ label: event.target.value })}
            placeholder="버튼 문구 (비우면 문서 제목 사용)"
            className="input-field text-sm"
          />
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
        </div>
      )}
    </div>
  );
}
