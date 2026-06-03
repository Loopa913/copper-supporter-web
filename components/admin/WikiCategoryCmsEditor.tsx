"use client";

import { useState, useTransition } from "react";
import { Loader2, Save, Check, Plus, Trash2, FolderPlus, FileText, ChevronRight } from "lucide-react";
import { updateSiteContent } from "@/app/admin/actions";
import { SoftCard } from "@/components/ui/SoftCard";
import { cn } from "@/lib/utils/cn";
import type { WikiCategory, WikiPage } from "@/lib/data/wiki";

type WikiCategoryCmsEditorProps = {
  initialCategories: WikiCategory[];
  initialPages: WikiPage[];
  disabled?: boolean;
};

export function WikiCategoryCmsEditor({
  initialCategories,
  initialPages,
  disabled = false,
}: WikiCategoryCmsEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [isSaved, setIsSaved] = useState(false);

  const [categories, setCategories] = useState<WikiCategory[]>(initialCategories);
  const [pages, setPages] = useState<WikiPage[]>(initialPages);
  
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>({});

  const togglePageExpand = (id: string) => {
    setExpandedPages(prev => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id] // toggle logic fix for default true
    }));
  };

  const handleAddCategory = () => {
    const newCategory: WikiCategory = {
      id: crypto.randomUUID(),
      title: "새 카테고리",
      slug: `category-${Date.now()}`,
      children: [],
    };
    setCategories([...categories, newCategory]);
  };

  const handleRemoveCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
    // Remove pages associated with this category
    const cat = categories.find((c) => c.id === id);
    if (cat) {
      setPages(pages.filter((p) => p.categorySlug !== cat.slug));
    }
  };

  const handleChangeCategory = (id: string, field: keyof WikiCategory, value: string) => {
    setCategories(categories.map((c) => {
      if (c.id !== id) return c;
      const updatedCat = { ...c, [field]: value };
      
      // If slug changed, update all pages that belong to it
      if (field === "slug" && c.slug !== value) {
        setPages(pages.map(p => p.categorySlug === c.slug ? { ...p, categorySlug: value } : p));
      }
      return updatedCat;
    }));
  };

  const renderPageEditor = (page: WikiPage, depth: number) => {
    const childPages = pages.filter((p) => p.parentSlug === page.slug);
    const isExpanded = expandedPages[page.id] !== false; // Default true

    return (
      <div key={page.id} className={cn("group flex flex-col gap-2", depth > 0 && "ml-4 mt-3 border-l-2 border-copper/10 pl-4")}>
        <div className="flex gap-3 items-start">
          <button
            type="button"
            onClick={() => togglePageExpand(page.id)}
            className={cn("mt-1.5 shrink-0 text-text-muted transition-colors hover:text-text-primary", childPages.length === 0 && "invisible")}
            disabled={childPages.length === 0}
          >
            <ChevronRight className={cn("h-4 w-4 transition-transform duration-200", isExpanded && "rotate-90")} />
          </button>
          
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={page.title}
                onChange={(e) => handleChangePage(page.id, "title", e.target.value)}
                placeholder="문서 제목"
                className="w-1/2 rounded-lg border border-border bg-surface-warm px-3 py-1.5 text-sm"
              />
              <div className="flex flex-1 items-center gap-2">
                <span className="text-xs text-text-muted shrink-0">Slug:</span>
                <input
                  type="text"
                  value={page.slug}
                  onChange={(e) => handleChangePage(page.id, "slug", e.target.value)}
                  placeholder="page-slug"
                  className="w-full rounded-lg border border-border bg-surface-warm px-3 py-1.5 text-xs text-text-secondary"
                />
              </div>
            </div>
            <input
              type="text"
              value={page.excerpt}
              onChange={(e) => handleChangePage(page.id, "excerpt", e.target.value)}
              placeholder="짧은 요약 (선택)"
              className="w-full rounded-lg border border-border bg-surface-warm px-3 py-1 text-xs text-text-secondary"
            />
          </div>
          
          <button
            type="button"
            onClick={() => {
              setExpandedPages(prev => ({ ...prev, [page.id]: true }));
              handleAddSubPage(page.slug, page.categorySlug);
            }}
            className="mt-1 p-1 text-copper opacity-0 transition-opacity hover:text-copper-dark group-hover:opacity-100 shrink-0"
            title="하위 문서 추가"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => handleRemovePage(page.id)}
            className="mt-1 p-1 text-red-400 opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100 shrink-0"
            title="문서 삭제"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        
        {childPages.length > 0 && isExpanded && (
          <div className="mt-2 space-y-3">
            {childPages.map(cp => renderPageEditor(cp, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const handleAddSubPage = (parentSlug: string, categorySlug: string) => {
    const newPage: WikiPage = {
      id: crypto.randomUUID(),
      title: "새 하위 문서",
      slug: `page-${Date.now()}`,
      categorySlug,
      parentSlug,
      excerpt: "짧은 설명을 입력하세요.",
      content: "",
    };
    setPages([...pages, newPage]);
  };

  const handleRemovePage = (id: string) => {
    setPages((prev) => {
      const target = prev.find(p => p.id === id);
      if (!target) return prev;

      const getDescendants = (slug: string): string[] => {
        const children = prev.filter(p => p.parentSlug === slug);
        let ids = children.map(c => c.id);
        children.forEach(c => {
          ids = [...ids, ...getDescendants(c.slug)];
        });
        return ids;
      };

      const idsToRemove = [id, ...getDescendants(target.slug)];
      return prev.filter(p => !idsToRemove.includes(p.id));
    });
  };

  const handleChangePage = (id: string, field: keyof WikiPage, value: string) => {
    setPages((prev) => {
      const target = prev.find(p => p.id === id);
      if (!target) return prev;
      
      let updated = prev.map((p) => (p.id === id ? { ...p, [field]: value } : p));
      
      // cascade slug
      if (field === "slug" && target.slug !== value) {
        updated = updated.map(p => p.parentSlug === target.slug ? { ...p, parentSlug: value } : p);
      }
      return updated;
    });
  };

  const handleSave = () => {
    if (disabled) return;

    startTransition(async () => {
      try {
        await updateSiteContent("wiki", "categories", JSON.stringify(categories));
        await updateSiteContent("wiki", "pages", JSON.stringify(pages));
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
            위키 카테고리 및 문서 구조 관리
          </h2>
          <p className="mt-1 text-xs font-light text-text-muted">
            사이드바에 표시될 카테고리와 문서를 추가하거나 삭제합니다. 문서 본문 편집은 위키 페이지에서 직접 가능합니다.
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

      <div className="p-6 space-y-6">
        {categories.map((cat) => {
          const categoryPages = pages.filter((p) => p.categorySlug === cat.slug);
          return (
            <div key={cat.id} className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={cat.title}
                      onChange={(e) => handleChangeCategory(cat.id, "title", e.target.value)}
                      placeholder="카테고리명 (예: 시작하기)"
                      className="w-full sm:w-1/2 rounded-lg border border-border bg-surface-warm px-3 py-1.5 text-sm font-semibold"
                    />
                    <div className="flex flex-1 items-center gap-2">
                      <span className="text-xs text-text-muted shrink-0">고유 주소(Slug):</span>
                      <input
                        type="text"
                        value={cat.slug}
                        onChange={(e) => handleChangeCategory(cat.id, "slug", e.target.value)}
                        placeholder="getting-started"
                        className="w-full rounded-lg border border-border bg-surface-warm px-3 py-1.5 text-xs text-text-secondary"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 pl-4 border-l-2 border-copper/20 space-y-3">
                    <p className="text-xs font-medium text-text-muted">문서 목록</p>
                    {categoryPages.filter(p => !p.parentSlug).map((page) => renderPageEditor(page, 0))}
                    
                    <button
                      type="button"
                      onClick={() => {
                        const newPage: WikiPage = {
                          id: crypto.randomUUID(),
                          title: "새 문서",
                          slug: `page-${Date.now()}`,
                          categorySlug: cat.slug,
                          excerpt: "짧은 설명을 입력하세요.",
                          content: "",
                        };
                        setPages([...pages, newPage]);
                      }}
                      className="flex items-center gap-1.5 text-xs font-medium text-copper hover:text-copper-dark transition-colors"
                    >
                      <FileText className="h-3 w-3" />
                      이 카테고리에 새 최상위 문서 추가
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveCategory(cat.id)}
                  className="p-1 text-red-400 transition-colors hover:text-red-600 shrink-0"
                  title="카테고리 전체 삭제"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={handleAddCategory}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-4 text-sm font-medium text-text-secondary transition-colors hover:border-copper hover:bg-copper-muted hover:text-copper"
        >
          <FolderPlus className="h-4 w-4" />
          새 카테고리 추가
        </button>
      </div>
    </SoftCard>
  );
}
