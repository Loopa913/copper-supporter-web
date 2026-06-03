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
}: WikiSidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(categories.map((c) => [c.id, true]))
  );

  return (
    <nav className="h-full overflow-y-auto p-4" aria-label="위키 목록">
      <p className="mb-4 px-2 text-xs font-medium text-text-muted">카퍼 위키</p>
      <ul className="space-y-0.5">
        {categories.map((cat) => {
          const categoryPages = pages.filter((p) => p.categorySlug === cat.slug);
          
          return (
          <li key={cat.id}>
            <button
              type="button"
              onClick={() => {
                setExpanded((e) => ({ ...e, [cat.id]: true }));
                onSelect(cat.slug);
              }}
              className={cn(
                "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors duration-200",
                activeSlug === cat.slug
                  ? "bg-copper-muted font-semibold text-copper"
                  : "font-medium text-text-secondary hover:bg-black/[0.03]"
              )}
            >
              <ChevronRight
                className={cn(
                  "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                  expanded[cat.id] && "rotate-90"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded((prev) => ({ ...prev, [cat.id]: !prev[cat.id] }));
                }}
              />
              <span className="truncate">{cat.title}</span>
            </button>
            {expanded[cat.id] && categoryPages.length > 0 && (
              <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-2">
                {categoryPages.map((child) => (
                  <li key={child.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(child.slug)}
                      className={cn(
                        "w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors duration-200",
                        activeSlug === child.slug
                          ? "bg-copper-muted font-medium text-copper"
                          : "font-normal text-text-secondary hover:bg-black/[0.03]"
                      )}
                    >
                      {child.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )})}
      </ul>
    </nav>
  );
}
