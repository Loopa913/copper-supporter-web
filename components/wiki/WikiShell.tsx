"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { PanelLeftClose, PanelLeft, Settings } from "lucide-react";
import type { WikiContent } from "@/lib/cms/wiki-content";
import { WikiSidebar } from "@/components/wiki/WikiSidebar";
import { WikiCategoryCmsEditor } from "@/components/admin/WikiCategoryCmsEditor";
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
  const [isEditingStructure, setIsEditingStructure] = useState(false);
  
  // Provide a safe fallback slug if none is available
  const defaultSlug = initialContent.pages.length > 0 ? initialContent.pages[0].slug : "";
  const [activeSlug, setActiveSlug] = useState(defaultSlug);
  
  const page = initialContent.pages.find((p) => p.slug === activeSlug) ?? initialContent.pages[0];

  return (
    <div className="font-wiki flex min-h-[calc(100vh-72px)] bg-white">
      <aside
        className={cn(
          "shrink-0 border-r border-border bg-[#FBFBFA] transition-all duration-300 ease-in-out flex flex-col",
          sidebarOpen ? "w-64" : "w-0 overflow-hidden border-0"
        )}
      >
        <div className="flex-1 overflow-y-auto">
          <WikiSidebar
            categories={initialContent.categories}
            pages={initialContent.pages}
            activeSlug={activeSlug}
            onSelect={(slug) => {
              setActiveSlug(slug);
              setIsEditingStructure(false);
            }}
          />
        </div>
        
        {isAdmin && (
          <div className="p-4 border-t border-border">
            <button
              type="button"
              onClick={() => setIsEditingStructure(true)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-copper transition-colors duration-200 hover:bg-copper-muted"
            >
              <Settings className="h-4 w-4" />
              카테고리 및 문서 편집
            </button>
          </div>
        )}
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
              {isEditingStructure ? "위키 구조 편집" : (page ? page.title : "문서 없음")}
            </h1>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto">
            {isEditingStructure ? (
              <div className="mx-auto w-full max-w-[800px] p-8">
                <WikiCategoryCmsEditor
                  initialCategories={initialContent.categories}
                  initialPages={initialContent.pages}
                  disabled={!isAdmin}
                />
              </div>
            ) : page ? (
              <WikiEditor key={page.id} page={page} editable={isAdmin} />
            ) : (
              <div className="p-12 text-center text-text-muted">문서가 없습니다. 관리자 페이지에서 추가해주세요.</div>
            )}
          </div>
        </div>
      </div>
    );
  }
