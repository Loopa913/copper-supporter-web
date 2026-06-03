"use client";

import { useTransition, useCallback } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import type { WikiPage } from "@/lib/data/wiki";
import { FadeIn } from "@/components/ui/FadeIn";
import { saveWikiPageContent } from "@/app/wiki/actions";

// Debounce helper
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

type WikiEditorProps = {
  page: WikiPage;
  editable?: boolean;
};

export function WikiEditor({ page, editable = true }: WikiEditorProps) {
  const [isPending, startTransition] = useTransition();

  const editor = useCreateBlockNote({
    initialContent: page.content ? JSON.parse(page.content) : undefined,
  });

  // Automatically save the document 1.5 seconds after the user stops typing
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

  return (
    <FadeIn className="mx-auto w-full max-w-[800px] flex-1 px-4 py-12 sm:px-12 relative">
      {/* Saving Indicator */}
      {isPending && (
        <div className="absolute top-4 right-12 text-xs text-text-muted animate-pulse">
          저장 중...
        </div>
      )}

      <div className="mb-8 px-[50px]">
        <h1 className="text-4xl font-bold tracking-tight text-text-primary">
          {page.title}
        </h1>
        {page.excerpt && (
          <p className="mt-4 text-sm font-light text-text-muted">
            {page.excerpt}
          </p>
        )}
      </div>
      
      {/* BlockNote Editor View */}
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme="light"
        className="font-pretendard"
        onChange={() => {
          if (!editable) return;
          const newContent = JSON.stringify(editor.document);
          debouncedSave(newContent);
        }}
      />
    </FadeIn>
  );
}
