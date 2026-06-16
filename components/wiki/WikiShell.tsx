"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { PanelLeftClose, PanelLeft, Settings } from "lucide-react";
import type { WikiContent } from "@/lib/cms/wiki-content";
import { WikiSidebar } from "@/components/wiki/WikiSidebar";
import { WikiCategoryCmsEditor } from "@/components/admin/WikiCategoryCmsEditor";
import { cn } from "@/lib/utils/cn";
import { buildWikiNavItems } from "@/lib/wiki/nav-items";

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
  const defaultSlug = initialContent.categories.length > 0 ? initialContent.categories[0].slug : "";
  const [activeSlug, setActiveSlug] = useState(defaultSlug);
  const navItems = buildWikiNavItems(initialContent.categories, initialContent.pages);
  const handleNavigate = (slug: string) => {
    setActiveSlug(slug);
    setIsEditingStructure(false);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    const hashSlug = window.location.hash.replace(/^#/, "");
    if (hashSlug && navItems.some((item) => item.slug === hashSlug)) {
      setActiveSlug(hashSlug);
    }
  }, [navItems]);
  
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!activeSlug) return;
    const nextUrl = `${window.location.pathname}${window.location.search}#${activeSlug}`;
    window.history.replaceState(null, "", nextUrl);
  }, [activeSlug]);
  
  let page = initialContent.pages.find((p) => p.slug === activeSlug);
  
  if (!page) {
    const category = initialContent.categories.find((c) => c.slug === activeSlug);
    if (category) {
      page = {
        id: category.id,
        slug: category.slug,
        title: category.title,
        categorySlug: "",
        excerpt: category.excerpt || "",
        content: category.content,
      };
    }
  }

  // Flatten items for navigation
  const flatItems = navItems;

  const currentIndex = flatItems.findIndex((item) => item.slug === activeSlug);
  const prevItem = currentIndex > 0 ? flatItems[currentIndex - 1] : null;
  const nextItem = currentIndex < flatItems.length - 1 && currentIndex !== -1 ? flatItems[currentIndex + 1] : null;

  return (
    <div className="font-wiki flex min-h-[calc(100vh-72px)] bg-white relative">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="absolute inset-0 z-10 bg-black/20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "absolute inset-y-0 left-0 z-20 flex h-full flex-col border-r border-border bg-[#FBFBFA] transition-all duration-300 ease-in-out md:static md:h-auto md:shrink-0",
          sidebarOpen
            ? "translate-x-0 w-64 shadow-2xl md:shadow-none"
            : "-translate-x-full w-64 overflow-hidden border-0 md:translate-x-0 md:w-0"
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
              if (window.innerWidth < 768) {
                setSidebarOpen(false);
              }
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
          <div className="flex-1 overflow-y-auto flex flex-col relative">
            <div className="flex-1">
              {isEditingStructure ? (
                <div className="mx-auto w-full max-w-[800px] p-8">
                  <WikiCategoryCmsEditor
                    initialCategories={initialContent.categories}
                    initialPages={initialContent.pages}
                    disabled={!isAdmin}
                  />
                </div>
              ) : page ? (
                <WikiEditor
                  key={page.id}
                  page={page}
                  navItems={navItems}
                  onNavigate={handleNavigate}
                  editable={isAdmin}
                />
              ) : (
                <div className="p-12 text-center text-text-muted">문서가 없습니다. 관리자 페이지에서 추가해주세요.</div>
              )}
            </div>
            
            {/* Previous / Next Navigation */}
            {!isEditingStructure && page && (
              <div className="mt-8 border-t border-border bg-[#FBFBFA]/50 px-5 py-8 md:bg-transparent md:py-12">
                <div className="mx-auto flex w-full max-w-[800px] items-center justify-between gap-4 md:px-[50px]">
                  {prevItem ? (
                    <button
                      type="button"
                      onClick={() => setActiveSlug(prevItem.slug)}
                      className="group flex flex-1 flex-col items-start rounded-xl border border-border bg-white p-4 text-left transition-colors hover:border-copper/30 hover:bg-copper/[0.02]"
                    >
                      <span className="text-[11px] font-medium tracking-wide text-text-muted transition-colors group-hover:text-copper/70">
                        이전 문서
                      </span>
                      <span className="mt-1.5 line-clamp-2 text-sm font-semibold tracking-tight text-text-primary transition-colors group-hover:text-copper">
                        {prevItem.title}
                      </span>
                    </button>
                  ) : (
                    <div className="flex-1" />
                  )}
                  
                  {nextItem ? (
                    <button
                      type="button"
                      onClick={() => setActiveSlug(nextItem.slug)}
                      className="group flex flex-1 flex-col items-end rounded-xl border border-border bg-white p-4 text-right transition-colors hover:border-copper/30 hover:bg-copper/[0.02]"
                    >
                      <span className="text-[11px] font-medium tracking-wide text-text-muted transition-colors group-hover:text-copper/70">
                        다음 문서
                      </span>
                      <span className="mt-1.5 line-clamp-2 text-sm font-semibold tracking-tight text-text-primary transition-colors group-hover:text-copper">
                        {nextItem.title}
                      </span>
                    </button>
                  ) : (
                    <div className="flex-1" />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
