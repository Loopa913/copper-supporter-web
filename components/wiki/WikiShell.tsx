"use client";

import { useState } from "react";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import {
  DEFAULT_WIKI_SLUG,
  WIKI_CATEGORIES,
  WIKI_PAGES,
} from "@/lib/data/wiki";
import { WikiSidebar } from "@/components/wiki/WikiSidebar";
import { WikiEditorPlaceholder } from "@/components/wiki/WikiEditorPlaceholder";
import { cn } from "@/lib/utils/cn";

export function WikiShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSlug, setActiveSlug] = useState(DEFAULT_WIKI_SLUG);
  const page = WIKI_PAGES.find((p) => p.slug === activeSlug) ?? WIKI_PAGES[0];

  return (
    <div className="font-wiki flex min-h-[calc(100vh-72px)] bg-white">
      <aside
        className={cn(
          "shrink-0 border-r border-border bg-[#FBFBFA] transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-0 overflow-hidden border-0"
        )}
      >
        <WikiSidebar
          categories={WIKI_CATEGORIES}
          activeSlug={activeSlug}
          onSelect={setActiveSlug}
        />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            className="rounded-xl border border-border p-2.5 text-text-secondary transition-all duration-300 ease-in-out hover:border-copper/20 hover:bg-copper-muted hover:text-copper"
            aria-label={sidebarOpen ? "사이드바 닫기" : "사이드바 열기"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeft className="h-4 w-4" />
            )}
          </button>
          <h1 className="truncate text-lg font-semibold tracking-tight text-text-primary">
            {page.title}
          </h1>
        </div>
        <WikiEditorPlaceholder page={page} />
      </div>
    </div>
  );
}
