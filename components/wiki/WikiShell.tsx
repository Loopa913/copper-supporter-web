"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import type { WikiContent } from "@/lib/cms/wiki-content";
import { WikiSidebar } from "@/components/wiki/WikiSidebar";
import { cn } from "@/lib/utils/cn";

// BlockNote uses browser APIs (like `window`) and must be dynamically imported
// with SSR disabled to prevent build errors during static generation.
const WikiEditor = dynamic(
  () => import("@/components/wiki/WikiEditor").then((mod) => mod.WikiEditor),
  { ssr: false, loading: () => <div className="p-12 text-center text-text-muted">에디터 로딩중...</div> }
);

type WikiShellProps = {
  isAdmin?: boolean;
  initialContent: WikiContent;
};

export function WikiShell({ isAdmin = false, initialContent }: WikiShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Provide a safe fallback slug if none is available
  const defaultSlug = initialContent.pages.length > 0 ? initialContent.pages[0].slug : "";
  const [activeSlug, setActiveSlug] = useState(defaultSlug);
  
  const page = initialContent.pages.find((p) => p.slug === activeSlug) ?? initialContent.pages[0];

  return (
    <div className="font-wiki flex min-h-[calc(100vh-72px)] bg-white">
      <aside
        className={cn(
          "shrink-0 border-r border-border bg-[#FBFBFA] transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-0 overflow-hidden border-0"
        )}
      >
        <WikiSidebar
          categories={initialContent.categories}
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
              {page ? page.title : "문서 없음"}
            </h1>
          </div>
          {/* Key prop ensures the editor completely re-mounts when switching pages */}
          {page ? (
            <WikiEditor key={page.id} page={page} editable={isAdmin} />
          ) : (
            <div className="p-12 text-center text-text-muted">문서가 없습니다. 관리자 페이지에서 추가해주세요.</div>
          )}
        </div>
      </div>
    );
  }
