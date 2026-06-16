"use client";

import { useCallback, useMemo, useTransition } from "react";
import {
  useCreateBlockNote,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import * as locales from "@blocknote/core/locales";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import type { WikiPage } from "@/lib/data/wiki";
import { FadeIn } from "@/components/ui/FadeIn";
import { saveWikiPageContent } from "@/app/wiki/actions";
import { WikiEditorContext } from "@/components/wiki/WikiEditorContext";
import { wikiBlockNoteSchema } from "@/lib/wiki/blocknote-schema";
import {
  getWikiSlugFromHref,
  toWikiHref,
  type WikiNavItem,
} from "@/lib/wiki/nav-items";

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

  const handleWikiLinkClick = useCallback(
    (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const slug = getWikiSlugFromHref(href);
      if (!slug) return;

      const exists = navItems.some((item) => item.slug === slug);
      if (!exists) return;

      event.preventDefault();
      onNavigate(slug);
    },
    [navItems, onNavigate]
  );

  const editor = useCreateBlockNote(
    {
      schema: wikiBlockNoteSchema,
      initialContent: page.content ? JSON.parse(page.content) : undefined,
      dictionary: locales.ko,
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
    [page.id, handleWikiLinkClick]
  );

  const debouncedSave = useCallback(
    debounce(async (documentJson: string) => {
      startTransition(async () => {
        try {
          await saveWikiPageContent(page.id, documentJson);
        } catch (error) {
          console.error("Failed to save wiki content:", error);
        }
      });
    }, 1500),
    [page.id]
  );

  const wikiButtonSlashItem = useMemo(
    () => ({
      title: "위키 페이지 버튼",
      subtext: "다른 위키 페이지로 이동하는 버튼을 추가합니다",
      aliases: ["버튼", "링크", "페이지", "이동"],
      group: "위키",
      onItemClick: () => {
        const cursor = editor.getTextCursorPosition();
        editor.insertBlocks(
          [
            {
              type: "wikiButton",
              props: {
                label: "페이지로 이동",
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

  const getSlashMenuItems = useCallback(
    async (query: string) => {
      const defaultItems = getDefaultReactSlashMenuItems(editor);
      const customItems = editable ? [wikiButtonSlashItem] : [];
      return filterMenuItems([...customItems, ...defaultItems], query);
    },
    [editor, editable, wikiButtonSlashItem]
  );

  const getMentionMenuItems = useCallback(
    async (query: string) => {
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
    },
    [editor, navItems]
  );

  return (
    <WikiEditorContext.Provider value={{ navItems, onNavigate, editable }}>
      <FadeIn className="relative mx-auto w-full max-w-[800px] flex-1 px-4 py-12 sm:px-12">
        {isPending && (
          <div className="absolute top-4 right-12 animate-pulse text-xs text-text-muted">
            저장 중...
          </div>
        )}

        <div className="mb-8 px-[50px]">
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
        >
          <SuggestionMenuController triggerCharacter="/" getItems={getSlashMenuItems} />
          <SuggestionMenuController
            triggerCharacter="@"
            getItems={getMentionMenuItems}
            minQueryLength={0}
          />
        </BlockNoteView>
      </FadeIn>
    </WikiEditorContext.Provider>
  );
}
