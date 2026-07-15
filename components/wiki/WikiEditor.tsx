"use client";

import { useCallback, useEffect, useMemo, useRef, useTransition, useState } from "react";
import {
  useCreateBlockNote,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import type { PartialBlock } from "@blocknote/core";
import * as locales from "@blocknote/core/locales";
import {
  getMultiColumnSlashMenuItems,
  multiColumnDropCursor,
  locales as multiColumnLocales,
} from "@blocknote/xl-multi-column";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import type { WikiPage } from "@/lib/data/wiki";
import { saveWikiPageContent } from "@/app/wiki/actions";
import { WikiEditorContext } from "@/components/wiki/WikiEditorContext";
import { wikiBlockNoteSchema } from "@/lib/wiki/blocknote-schema";
import {
  getWikiSlugFromHref,
  toWikiHref,
  type WikiNavItem,
} from "@/lib/wiki/nav-items";
import { sanitizeWikiInitialContent } from "@/lib/wiki/sanitize-content";

function debounce<T extends (...args: Parameters<T>) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

type WikiEditorProps = {
  page: WikiPage;
  navItems: WikiNavItem[];
  onNavigate: (slug: string) => void;
  editable?: boolean;
};

function filterMenuItems<T extends { title: string; aliases?: string[] }>(items: T[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return items;

  return items.filter((item) => {
    const haystack = [item.title, ...(item.aliases || [])].join(" ").toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

export function WikiEditor({
  page,
  navItems,
  onNavigate,
  editable = true,
}: WikiEditorProps) {
  const [isPending, startTransition] = useTransition();
  const cleanedLegacyBlocksRef = useRef(false);

  const { blocks: initialBlocks, wasSanitized } = useMemo(
    () => sanitizeWikiInitialContent(page.content),
    [page.content]
  );

  const handleWikiLinkClick = useCallback(
    (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const slug = getWikiSlugFromHref(href);
      if (!slug) return;

      if (!navItems.some((item) => item.slug === slug)) return;

      event.preventDefault();
      onNavigate(slug);
    },
    [navItems, onNavigate]
  );

  const editor = useCreateBlockNote(
    {
      schema: wikiBlockNoteSchema,
      initialContent: initialBlocks as PartialBlock[] | undefined,
      dropCursor: multiColumnDropCursor,
      dictionary: {
        ...locales.ko,
        slash_menu: {
          ...locales.ko?.slash_menu,
          ...(multiColumnLocales.ko?.slash_menu || {}),
        },
      },
      links: {
        HTMLAttributes: {
          class: "wiki-internal-link",
        },
        isValidLink: (href) =>
          /^(https?:\/\/|mailto:|tel:|wiki:)/.test(href) || href.startsWith("#"),
        onClick: (event) => {
          handleWikiLinkClick(event);
        },
      },
    },
    [page.id, handleWikiLinkClick, initialBlocks]
  );

  useEffect(() => {
    if (!editable || !wasSanitized || cleanedLegacyBlocksRef.current) return;
    cleanedLegacyBlocksRef.current = true;

    startTransition(async () => {
      try {
        await saveWikiPageContent(page.id, JSON.stringify(editor.document));
      } catch (error) {
        console.error("Failed to clean legacy wiki blocks:", error);
      }
    });
  }, [editable, wasSanitized, page.id, editor]);

  const debouncedSave = useCallback(
    debounce(async (documentJson: string) => {
      startTransition(async () => {
        try {
          await saveWikiPageContent(page.id, documentJson);
        } catch (error) {
          console.error("Failed to save wiki content", error);
        }
      });
    }, 1500),
    [page.id]
  );

  const wikiButtonSlashItem = useMemo(
    () => ({
      title: "페이지 링크",
      subtext: "다른 위키 문서로 이동하는 노션 스타일 링크 박스",
      aliases: ["버튼", "링크", "이동", "페이지"],
      group: "위키",
      onItemClick: () => {
        const cursor = editor.getTextCursorPosition();
        editor.insertBlocks(
          [
            {
              type: "wikiButton",
              props: {
                label: "",
                targetSlug: "",
                targetTitle: "",
              },
            },
          ],
          cursor.block,
          "after"
        );
      },
    }),
    [editor]
  );

  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      // document.body의 최하단에 전용 포털을 생성하여 그 어떤 요소보다도 위에 렌더링되도록 강제합니다.
      const el = document.createElement("div");
      el.className = "bn-root bn-shadcn light font-pretendard wiki-portal-root";
      el.style.position = "fixed"; // absolute 대신 fixed로 변경하여 스크롤에 관계없이 최상단 유지
      el.style.zIndex = "2147483647";
      el.style.top = "0";
      el.style.left = "0";
      el.style.width = "100%";
      el.style.height = "0"; // 높이를 0으로 주어 레이아웃에 영향을 주지 않음
      el.style.pointerEvents = "none"; // 클릭은 하위 요소(팝오버)에서 받도록 함
      document.body.appendChild(el);
      setPortalElement(el);

      return () => {
        if (document.body.contains(el)) {
          document.body.removeChild(el);
        }
      };
    }
  }, []);

  const getSlashMenuItems = useCallback(
    async (query: string) => {
      let defaultItems: any[] = [];
      let multiColumnItems: any[] = [];
      
      try {
        defaultItems = getDefaultReactSlashMenuItems(editor);
      } catch (err) {
        console.error("Failed to load default slash items:", err);
      }

      try {
        if (editable) {
          multiColumnItems = getMultiColumnSlashMenuItems(editor);
        }
      } catch (err) {
        console.error("Failed to load multi-column slash items:", err);
      }

      const customItems = editable ? [wikiButtonSlashItem] : [];
      return filterMenuItems(
        [...customItems, ...multiColumnItems, ...defaultItems],
        query
      );
    },
    [editor, editable, wikiButtonSlashItem]
  );

  const getMentionMenuItems = useCallback(
    async (query: string) => {
      try {
        return filterMenuItems(
          navItems.map((item) => ({
            title: item.title,
            subtext: item.slug,
            aliases: [item.slug],
            group: "위키 페이지",
            onItemClick: () => {
              editor.createLink(toWikiHref(item.slug), item.title);
            },
          })),
          query
        );
      } catch (error) {
        console.error("Failed to load wiki mention menu items:", error);
        return [];
      }
    },
    [editor, navItems]
  );

  return (
    <WikiEditorContext.Provider value={{ navItems, onNavigate, editable }}>
      <div className="wiki-editor-shell relative mx-auto w-full max-w-6xl flex-1 px-12 py-12">
        {isPending && (
          <div className="absolute top-4 right-12 animate-pulse text-xs text-text-muted">
            저장 중...
          </div>
        )}

        <div className="mb-8 px-12">
          <h1 className="text-4xl font-bold tracking-tight text-text-primary">{page.title}</h1>
          {page.excerpt && (
            <p className="mt-4 text-sm font-light text-text-muted">{page.excerpt}</p>
          )}
        </div>

        <BlockNoteView
          editor={editor}
          editable={editable}
          theme="light"
          className="font-pretendard wiki-blocknote"
          slashMenu={false}
          onChange={() => {
            if (!editable) return;
            debouncedSave(JSON.stringify(editor.document));
          }}
          portalElements={portalElement ? { default: portalElement } : undefined}
        >
          <SuggestionMenuController
            triggerCharacter="/"
            getItems={getSlashMenuItems}
            portalElement={portalElement || undefined}
          />
          {editable && (
            <SuggestionMenuController
              triggerCharacter="@"
              getItems={getMentionMenuItems}
              minQueryLength={0}
              portalElement={portalElement || undefined}
            />
          )}
        </BlockNoteView>
      </div>
    </WikiEditorContext.Provider>
  );
}
