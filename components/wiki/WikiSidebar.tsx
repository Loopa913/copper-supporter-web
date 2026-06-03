"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";
import type { WikiCategory, WikiPage } from "@/lib/data/wiki";
import { cn } from "@/lib/utils/cn";

type WikiSidebarProps = {
  categories: WikiCategory[];
  pages: WikiPage[];
  activeSlug: string;
  onSelect: (slug: string) => void;
};

export function WikiSidebar({
  categories,
  pages,
  activeSlug,
  onSelect,
  onAddPage,
}: WikiSidebarProps & { onAddPage?: (parentSlug: string) => void }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(categories.map((c) => [c.id, true]))
  );

  const toggleExpand = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderPages = (parentId: string | null, categorySlug: string, depth: number) => {
    const childPages = pages.filter((p) => p.categorySlug === categorySlug && (p.parentSlug || null) === parentId);
    if (childPages.length === 0) return null;

    return (
      <ul className={cn("space-y-0.5 border-l border-border", depth === 0 ? "ml-4 mt-0.5 pl-2" : "ml-2 mt-0.5 pl-2")}>
        {childPages.map((child) => {
          const hasChildren = pages.some((p) => p.parentSlug === child.slug);
          return (
            <li key={child.id}>
              <div
                className={cn(
                  "group flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors duration-200",
                  activeSlug === child.slug
                    ? "bg-copper-muted font-semibold text-copper"
                    : "font-medium text-text-secondary hover:bg-black/[0.03]",
                  "cursor-pointer"
                )}
                onClick={() => {
                  if (hasChildren) setExpanded((e) => ({ ...e, [child.id]: true }));
                  onSelect(child.slug);
                }}
              >
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <div
                    className="flex shrink-0 items-center justify-center w-4 h-4 cursor-pointer"
                    onClick={(e) => hasChildren ? toggleExpand(child.id, e) : undefined}
                  >
                    {hasChildren ? (
                      <ChevronRight
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-200 text-text-muted hover:text-text-primary",
                          expanded[child.id] && "rotate-90"
                        )}
                      />
                    ) : (
                      <span className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className="truncate">{child.title || "제목 없음"}</span>
                </div>

                {onAddPage && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpanded((prev) => ({ ...prev, [child.id]: true }));
                      onAddPage(child.slug);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-text-muted hover:bg-black/5 hover:text-text-primary rounded transition-all shrink-0"
                    title="하위 문서 추가"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  </button>
                )}
              </div>
              {expanded[child.id] && renderPages(child.slug, categorySlug, depth + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <nav className="h-full overflow-y-auto p-4" aria-label="위키 목록">
      <p className="mb-4 px-2 text-xs font-medium text-text-muted">유니버스 위키</p>
      <ul className="space-y-0.5">
        {categories.map((cat) => {
          return (
          <li key={cat.id}>
            <div
              className={cn(
                "group flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors duration-200",
                activeSlug === cat.slug
                  ? "bg-copper-muted font-semibold text-copper"
                  : "font-medium text-text-secondary hover:bg-black/[0.03]",
                "cursor-pointer"
              )}
              onClick={() => {
                setExpanded((e) => ({ ...e, [cat.id]: true }));
                onSelect(cat.slug);
              }}
            >
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <div
                  className="flex shrink-0 items-center justify-center w-4 h-4 cursor-pointer"
                  onClick={(e) => toggleExpand(cat.id, e)}
                >
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200 text-text-muted hover:text-text-primary",
                      expanded[cat.id] && "rotate-90"
                    )}
                  />
                </div>
                <span className="truncate">{cat.title || "제목 없음"}</span>
              </div>

              {onAddPage && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded((prev) => ({ ...prev, [cat.id]: true }));
                    onAddPage(cat.slug);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 text-text-muted hover:bg-black/5 hover:text-text-primary rounded transition-all shrink-0"
                  title="하위 문서 추가"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </button>
              )}
            </div>
            {expanded[cat.id] && renderPages(null, cat.slug, 0)}
          </li>
        )})}
      </ul>
    </nav>
  );
}
